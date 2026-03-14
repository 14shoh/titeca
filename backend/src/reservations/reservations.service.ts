import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { BoothReservation } from './entities/booth-reservation.entity';
import { Booth } from '../booths/entities/booth.entity';
import { Payment } from '../payments/entities/payment.entity';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { BoothStatus } from '../common/enums/booth-status.enum';
import { ReservationStatus } from '../common/enums/reservation-status.enum';
import { PaymentStatus } from '../common/enums/payment-status.enum';
import { Role } from '../common/enums/role.enum';

@Injectable()
export class ReservationsService {
  constructor(
    @InjectRepository(BoothReservation)
    private readonly reservationRepository: Repository<BoothReservation>,
    @InjectRepository(Booth)
    private readonly boothRepository: Repository<Booth>,
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
    private readonly dataSource: DataSource,
  ) {}

  async create(userId: string, dto: CreateReservationDto) {
    return this.dataSource.transaction(async (manager) => {
      const booth = await manager.findOne(Booth, { where: { id: dto.boothId } });
      if (!booth) throw new NotFoundException('Booth not found');
      if (booth.status !== BoothStatus.AVAILABLE) {
        throw new BadRequestException('Booth is not available');
      }

      const reservation = manager.create(BoothReservation, {
        boothId: dto.boothId,
        userId,
        companyId: dto.companyId || null,
        status: ReservationStatus.PENDING,
        paymentStatus: PaymentStatus.PENDING,
      });
      await manager.save(reservation);

      booth.status = BoothStatus.RESERVED;
      await manager.save(booth);

      const payment = manager.create(Payment, {
        userId,
        reservationId: reservation.id,
        amount: booth.price,
        currency: 'TJS',
        status: PaymentStatus.PENDING,
        method: dto.method || null,
      });
      await manager.save(payment);

      return { reservation, payment };
    });
  }

  async getMyReservations(userId: string) {
    return this.reservationRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
      relations: ['booth', 'booth.exhibition', 'company'],
    });
  }

  async confirm(id: string) {
    const reservation = await this.reservationRepository.findOne({ where: { id } });
    if (!reservation) throw new NotFoundException('Reservation not found');

    await this.dataSource.transaction(async (manager) => {
      reservation.status = ReservationStatus.CONFIRMED;
      reservation.paymentStatus = PaymentStatus.SUCCESS;
      await manager.save(reservation);
      await manager.update(Booth, reservation.boothId, { status: BoothStatus.PAID });
      await manager.update(Payment, { reservationId: id }, { status: PaymentStatus.SUCCESS });
    });

    return this.reservationRepository.findOne({ where: { id } });
  }

  async cancel(id: string, userId: string, role: Role) {
    const reservation = await this.reservationRepository.findOne({ where: { id } });
    if (!reservation) throw new NotFoundException('Reservation not found');
    if (role !== Role.ADMIN && reservation.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    await this.dataSource.transaction(async (manager) => {
      reservation.status = ReservationStatus.CANCELLED;
      await manager.save(reservation);
      await manager.update(Booth, reservation.boothId, { status: BoothStatus.AVAILABLE });
    });

    return this.reservationRepository.findOne({ where: { id } });
  }

  async findAll(pagination: { page?: number; limit?: number }) {
    const { page = 1, limit = 10 } = pagination;
    const [items, total] = await this.reservationRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
      relations: ['booth', 'user', 'company'],
    });
    return { items, total, page, limit, pages: Math.ceil(total / limit) };
  }
}

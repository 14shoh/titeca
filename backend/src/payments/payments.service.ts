import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Payment } from './entities/payment.entity';
import { BoothReservation } from '../reservations/entities/booth-reservation.entity';
import { Booth } from '../booths/entities/booth.entity';
import { PaymentWebhookDto } from './dto/payment-webhook.dto';
import { PaymentStatus } from '../common/enums/payment-status.enum';
import { ReservationStatus } from '../common/enums/reservation-status.enum';
import { BoothStatus } from '../common/enums/booth-status.enum';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
    @InjectRepository(BoothReservation)
    private readonly reservationRepository: Repository<BoothReservation>,
    @InjectRepository(Booth)
    private readonly boothRepository: Repository<Booth>,
    private readonly dataSource: DataSource,
  ) {}

  async getMyPayments(userId: string) {
    return this.paymentRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
      relations: ['reservation'],
    });
  }

  async handleWebhook(paymentId: string, dto: PaymentWebhookDto) {
    const payment = await this.paymentRepository.findOne({
      where: { id: paymentId },
      relations: ['reservation', 'reservation.booth'],
    });
    if (!payment) throw new NotFoundException('Payment not found');

    await this.dataSource.transaction(async (manager) => {
      payment.status = dto.status;
      if (dto.transactionId) payment.transactionId = dto.transactionId;
      await manager.save(payment);

      const reservation = payment.reservation;

      if (dto.status === PaymentStatus.SUCCESS) {
        reservation.status = ReservationStatus.CONFIRMED;
        reservation.paymentStatus = PaymentStatus.SUCCESS;
        await manager.save(reservation);

        await manager.update(Booth, reservation.boothId, { status: BoothStatus.PAID });
      } else if (dto.status === PaymentStatus.FAILED) {
        reservation.status = ReservationStatus.CANCELLED;
        reservation.paymentStatus = PaymentStatus.FAILED;
        await manager.save(reservation);

        await manager.update(Booth, reservation.boothId, { status: BoothStatus.AVAILABLE });
      }
    });

    return { message: 'Webhook processed' };
  }

  async findAll(pagination: { page?: number; limit?: number }) {
    const { page = 1, limit = 10 } = pagination;
    const [items, total] = await this.paymentRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
      relations: ['user', 'reservation'],
    });
    return { items, total, page, limit, pages: Math.ceil(total / limit) };
  }
}

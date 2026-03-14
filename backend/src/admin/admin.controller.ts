import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';
import { User } from '../users/entities/user.entity';
import { Exhibition } from '../exhibitions/entities/exhibition.entity';
import { BoothReservation } from '../reservations/entities/booth-reservation.entity';
import { Payment } from '../payments/entities/payment.entity';
import { Application } from '../applications/entities/application.entity';
import { PaginationDto } from '../common/dto/pagination.dto';
import { ReservationsService } from '../reservations/reservations.service';
import { PaymentsService } from '../payments/payments.service';
import { ApplicationsService } from '../applications/applications.service';

@ApiTags('admin')
@ApiBearerAuth()
@Roles(Role.ADMIN)
@Controller('admin')
export class AdminController {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Exhibition) private readonly exhibitionRepository: Repository<Exhibition>,
    @InjectRepository(BoothReservation) private readonly reservationRepository: Repository<BoothReservation>,
    @InjectRepository(Payment) private readonly paymentRepository: Repository<Payment>,
    @InjectRepository(Application) private readonly applicationRepository: Repository<Application>,
    private readonly reservationsService: ReservationsService,
    private readonly paymentsService: PaymentsService,
    private readonly applicationsService: ApplicationsService,
  ) {}

  @Get('dashboard')
  async getDashboard() {
    const [totalUsers, totalExhibitions, totalReservations, totalPayments, totalApplications] =
      await Promise.all([
        this.userRepository.count(),
        this.exhibitionRepository.count(),
        this.reservationRepository.count(),
        this.paymentRepository.count(),
        this.applicationRepository.count(),
      ]);

    const recentReservations = await this.reservationRepository.find({
      order: { createdAt: 'DESC' },
      take: 5,
      relations: ['user', 'booth'],
    });

    return {
      stats: {
        totalUsers,
        totalExhibitions,
        totalReservations,
        totalPayments,
        totalApplications,
      },
      recentReservations,
    };
  }

  @Get('reservations')
  getAllReservations(@Query() pagination: PaginationDto) {
    return this.reservationsService.findAll(pagination);
  }

  @Get('payments')
  getAllPayments(@Query() pagination: PaginationDto) {
    return this.paymentsService.findAll(pagination);
  }

  @Get('applications')
  getAllApplications(@Query() pagination: PaginationDto) {
    return this.applicationsService.findAll(pagination);
  }
}

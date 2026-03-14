import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminController } from './admin.controller';
import { User } from '../users/entities/user.entity';
import { Exhibition } from '../exhibitions/entities/exhibition.entity';
import { BoothReservation } from '../reservations/entities/booth-reservation.entity';
import { Payment } from '../payments/entities/payment.entity';
import { Application } from '../applications/entities/application.entity';
import { ReservationsModule } from '../reservations/reservations.module';
import { PaymentsModule } from '../payments/payments.module';
import { ApplicationsModule } from '../applications/applications.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Exhibition, BoothReservation, Payment, Application]),
    ReservationsModule,
    PaymentsModule,
    ApplicationsModule,
  ],
  controllers: [AdminController],
})
export class AdminModule {}

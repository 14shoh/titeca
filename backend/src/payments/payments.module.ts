import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { Payment } from './entities/payment.entity';
import { BoothReservation } from '../reservations/entities/booth-reservation.entity';
import { Booth } from '../booths/entities/booth.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Payment, BoothReservation, Booth])],
  controllers: [PaymentsController],
  providers: [PaymentsService],
  exports: [PaymentsService],
})
export class PaymentsModule {}

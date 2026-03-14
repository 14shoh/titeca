import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from '../users/entities/user.entity';
import { Company } from '../companies/entities/company.entity';
import { Product } from '../companies/entities/product.entity';
import { Exhibition } from '../exhibitions/entities/exhibition.entity';
import { ExhibitionProgram } from '../exhibitions/entities/exhibition-program.entity';
import { ExhibitionParticipant } from '../exhibitions/entities/exhibition-participant.entity';
import { Booth } from '../booths/entities/booth.entity';
import { BoothReservation } from '../reservations/entities/booth-reservation.entity';
import { Payment } from '../payments/entities/payment.entity';
import { Application } from '../applications/entities/application.entity';
import { ApplicationDocument } from '../applications/entities/application-document.entity';
import { News } from '../news/entities/news.entity';
import { Banner } from '../banners/entities/banner.entity';
import { Message } from '../messages/entities/message.entity';
import { Partner } from '../partners/entities/partner.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('database.host'),
        port: configService.get('database.port'),
        username: configService.get('database.username'),
        password: configService.get('database.password'),
        database: configService.get('database.database'),
        entities: [
          User,
          Company,
          Product,
          Exhibition,
          ExhibitionProgram,
          ExhibitionParticipant,
          Booth,
          BoothReservation,
          Payment,
          Application,
          ApplicationDocument,
          News,
          Banner,
          Message,
          Partner,
        ],
        synchronize: configService.get('app.nodeEnv') !== 'production',
        logging: configService.get('app.nodeEnv') === 'development',
      }),
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}

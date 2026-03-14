import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BoothsService } from './booths.service';
import { BoothsController } from './booths.controller';
import { Booth } from './entities/booth.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Booth])],
  controllers: [BoothsController],
  providers: [BoothsService],
  exports: [BoothsService],
})
export class BoothsModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExhibitionsService } from './exhibitions.service';
import { ExhibitionsController } from './exhibitions.controller';
import { Exhibition } from './entities/exhibition.entity';
import { ExhibitionProgram } from './entities/exhibition-program.entity';
import { ExhibitionParticipant } from './entities/exhibition-participant.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Exhibition, ExhibitionProgram, ExhibitionParticipant])],
  controllers: [ExhibitionsController],
  providers: [ExhibitionsService],
  exports: [ExhibitionsService],
})
export class ExhibitionsModule {}

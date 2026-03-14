import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Exhibition } from './entities/exhibition.entity';
import { ExhibitionProgram } from './entities/exhibition-program.entity';
import { ExhibitionParticipant } from './entities/exhibition-participant.entity';
import { CreateExhibitionDto } from './dto/create-exhibition.dto';
import { UpdateExhibitionDto } from './dto/update-exhibition.dto';
import { CreateProgramDto } from './dto/create-program.dto';
import { ExhibitionFilterDto } from './dto/exhibition-filter.dto';

@Injectable()
export class ExhibitionsService {
  constructor(
    @InjectRepository(Exhibition)
    private readonly exhibitionRepository: Repository<Exhibition>,
    @InjectRepository(ExhibitionProgram)
    private readonly programRepository: Repository<ExhibitionProgram>,
    @InjectRepository(ExhibitionParticipant)
    private readonly participantRepository: Repository<ExhibitionParticipant>,
  ) {}

  async create(dto: CreateExhibitionDto): Promise<Exhibition> {
    const exhibition = this.exhibitionRepository.create(dto);
    return this.exhibitionRepository.save(exhibition);
  }

  async findAll(filter: ExhibitionFilterDto) {
    const { page = 1, limit = 10, industry, status, city, startDate, endDate } = filter;
    const qb = this.exhibitionRepository.createQueryBuilder('e');

    if (industry) qb.andWhere('e.industry = :industry', { industry });
    if (status) qb.andWhere('e.status = :status', { status });
    if (city) qb.andWhere('e.city LIKE :city', { city: `%${city}%` });
    if (startDate) qb.andWhere('e.startDate >= :startDate', { startDate });
    if (endDate) qb.andWhere('e.endDate <= :endDate', { endDate });

    qb.orderBy('e.startDate', 'ASC')
      .skip((page - 1) * limit)
      .take(limit);

    const [items, total] = await qb.getManyAndCount();
    return { items, total, page, limit, pages: Math.ceil(total / limit) };
  }

  async findOne(id: string): Promise<Exhibition> {
    const exhibition = await this.exhibitionRepository.findOne({ where: { id } });
    if (!exhibition) throw new NotFoundException('Exhibition not found');
    return exhibition;
  }

  async update(id: string, dto: UpdateExhibitionDto): Promise<Exhibition> {
    await this.findOne(id);
    await this.exhibitionRepository.update(id, dto as any);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);
    await this.exhibitionRepository.delete(id);
  }

  async addProgram(exhibitionId: string, dto: CreateProgramDto): Promise<ExhibitionProgram> {
    await this.findOne(exhibitionId);
    const program = this.programRepository.create({ ...dto, exhibitionId });
    return this.programRepository.save(program);
  }

  async getPrograms(exhibitionId: string): Promise<ExhibitionProgram[]> {
    await this.findOne(exhibitionId);
    return this.programRepository.find({
      where: { exhibitionId },
      order: { startTime: 'ASC' },
    });
  }

  async removeProgram(exhibitionId: string, programId: string): Promise<void> {
    await this.programRepository.delete({ id: programId, exhibitionId });
  }

  async addParticipant(exhibitionId: string, companyId: string): Promise<ExhibitionParticipant> {
    await this.findOne(exhibitionId);
    const existing = await this.participantRepository.findOne({ where: { exhibitionId, companyId } });
    if (existing) return existing;
    const participant = this.participantRepository.create({ exhibitionId, companyId });
    return this.participantRepository.save(participant);
  }

  async getParticipants(exhibitionId: string) {
    await this.findOne(exhibitionId);
    return this.participantRepository.find({
      where: { exhibitionId },
      relations: ['company'],
    });
  }

  async removeParticipant(exhibitionId: string, participantId: string): Promise<void> {
    await this.participantRepository.delete({ id: participantId, exhibitionId });
  }
}

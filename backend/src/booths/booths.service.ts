import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Booth } from './entities/booth.entity';
import { CreateBoothDto } from './dto/create-booth.dto';
import { UpdateBoothDto } from './dto/update-booth.dto';

@Injectable()
export class BoothsService {
  constructor(
    @InjectRepository(Booth)
    private readonly boothRepository: Repository<Booth>,
  ) {}

  async create(exhibitionId: string, dto: CreateBoothDto): Promise<Booth> {
    const booth = this.boothRepository.create({ ...dto, exhibitionId });
    return this.boothRepository.save(booth);
  }

  async findAll(exhibitionId: string): Promise<Booth[]> {
    return this.boothRepository.find({
      where: { exhibitionId },
      order: { number: 'ASC' },
    });
  }

  async findOne(exhibitionId: string, id: string): Promise<Booth> {
    const booth = await this.boothRepository.findOne({ where: { id, exhibitionId } });
    if (!booth) throw new NotFoundException('Booth not found');
    return booth;
  }

  async findById(id: string): Promise<Booth> {
    const booth = await this.boothRepository.findOne({ where: { id } });
    if (!booth) throw new NotFoundException('Booth not found');
    return booth;
  }

  async update(exhibitionId: string, id: string, dto: UpdateBoothDto): Promise<Booth> {
    await this.findOne(exhibitionId, id);
    await this.boothRepository.update(id, dto);
    return this.findOne(exhibitionId, id);
  }

  async remove(exhibitionId: string, id: string): Promise<void> {
    await this.findOne(exhibitionId, id);
    await this.boothRepository.delete(id);
  }
}

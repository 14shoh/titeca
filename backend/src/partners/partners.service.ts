import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Partner } from './entities/partner.entity';
import { CreatePartnerDto } from './dto/create-partner.dto';

@Injectable()
export class PartnersService {
  constructor(
    @InjectRepository(Partner)
    private readonly partnerRepository: Repository<Partner>,
  ) {}

  async create(dto: CreatePartnerDto): Promise<Partner> {
    const partner = this.partnerRepository.create(dto);
    return this.partnerRepository.save(partner);
  }

  async findAll(): Promise<Partner[]> {
    return this.partnerRepository.find({ where: { isActive: true }, order: { order: 'ASC' } });
  }

  async update(id: string, dto: Partial<CreatePartnerDto>): Promise<Partner> {
    const partner = await this.partnerRepository.findOne({ where: { id } });
    if (!partner) throw new NotFoundException('Partner not found');
    await this.partnerRepository.update(id, dto);
    return this.partnerRepository.findOne({ where: { id } });
  }

  async remove(id: string): Promise<void> {
    await this.partnerRepository.delete(id);
  }
}

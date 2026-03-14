import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Banner } from './entities/banner.entity';
import { CreateBannerDto } from './dto/create-banner.dto';

@Injectable()
export class BannersService {
  constructor(
    @InjectRepository(Banner)
    private readonly bannerRepository: Repository<Banner>,
  ) {}

  async create(dto: CreateBannerDto): Promise<Banner> {
    const banner = this.bannerRepository.create(dto);
    return this.bannerRepository.save(banner);
  }

  async findAll(): Promise<Banner[]> {
    return this.bannerRepository.find({ where: { isActive: true }, order: { order: 'ASC' } });
  }

  async findAllAdmin(): Promise<Banner[]> {
    return this.bannerRepository.find({ order: { order: 'ASC' } });
  }

  async update(id: string, dto: Partial<CreateBannerDto>): Promise<Banner> {
    const banner = await this.bannerRepository.findOne({ where: { id } });
    if (!banner) throw new NotFoundException('Banner not found');
    await this.bannerRepository.update(id, dto);
    return this.bannerRepository.findOne({ where: { id } });
  }

  async remove(id: string): Promise<void> {
    await this.bannerRepository.delete(id);
  }
}

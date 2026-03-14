import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Company } from './entities/company.entity';
import { Product } from './entities/product.entity';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { Role } from '../common/enums/role.enum';

@Injectable()
export class CompaniesService {
  constructor(
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async create(userId: string, createCompanyDto: CreateCompanyDto): Promise<Company> {
    const company = this.companyRepository.create({ ...createCompanyDto, userId });
    return this.companyRepository.save(company);
  }

  async findAll(pagination: PaginationDto) {
    const { page = 1, limit = 10 } = pagination;
    const [items, total] = await this.companyRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
      relations: ['user'],
    });
    return { items, total, page, limit, pages: Math.ceil(total / limit) };
  }

  async findOne(id: string): Promise<Company> {
    const company = await this.companyRepository.findOne({
      where: { id },
      relations: ['user'],
    });
    if (!company) throw new NotFoundException('Company not found');
    return company;
  }

  async findByUserId(userId: string): Promise<Company> {
    return this.companyRepository.findOne({ where: { userId } });
  }

  async update(id: string, userId: string, role: Role, updateCompanyDto: UpdateCompanyDto): Promise<Company> {
    const company = await this.findOne(id);
    if (role !== Role.ADMIN && company.userId !== userId) {
      throw new ForbiddenException('You can only update your own company');
    }
    await this.companyRepository.update(id, updateCompanyDto);
    return this.findOne(id);
  }

  async remove(id: string, userId: string, role: Role): Promise<void> {
    const company = await this.findOne(id);
    if (role !== Role.ADMIN && company.userId !== userId) {
      throw new ForbiddenException('You can only delete your own company');
    }
    await this.companyRepository.delete(id);
  }

  async addProduct(companyId: string, userId: string, role: Role, dto: CreateProductDto): Promise<Product> {
    const company = await this.findOne(companyId);
    if (role !== Role.ADMIN && company.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }
    const product = this.productRepository.create({ ...dto, companyId });
    return this.productRepository.save(product);
  }

  async getProducts(companyId: string) {
    await this.findOne(companyId);
    return this.productRepository.find({ where: { companyId }, order: { createdAt: 'DESC' } });
  }

  async removeProduct(companyId: string, productId: string, userId: string, role: Role): Promise<void> {
    const company = await this.findOne(companyId);
    if (role !== Role.ADMIN && company.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }
    await this.productRepository.delete({ id: productId, companyId });
  }
}

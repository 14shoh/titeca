import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Application } from './entities/application.entity';
import { ApplicationDocument } from './entities/application-document.entity';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';
import { CreateDocumentDto } from './dto/create-document.dto';
import { Role } from '../common/enums/role.enum';

@Injectable()
export class ApplicationsService {
  constructor(
    @InjectRepository(Application)
    private readonly applicationRepository: Repository<Application>,
    @InjectRepository(ApplicationDocument)
    private readonly documentRepository: Repository<ApplicationDocument>,
  ) {}

  async create(userId: string, dto: CreateApplicationDto): Promise<Application> {
    const application = this.applicationRepository.create({ ...dto, userId });
    return this.applicationRepository.save(application);
  }

  async getMyApplications(userId: string) {
    return this.applicationRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
      relations: ['exhibition'],
    });
  }

  async findAll(pagination: { page?: number; limit?: number }) {
    const { page = 1, limit = 10 } = pagination;
    const [items, total] = await this.applicationRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
      relations: ['user', 'exhibition'],
    });
    return { items, total, page, limit, pages: Math.ceil(total / limit) };
  }

  async findOne(id: string): Promise<Application> {
    const application = await this.applicationRepository.findOne({
      where: { id },
      relations: ['user', 'exhibition'],
    });
    if (!application) throw new NotFoundException('Application not found');
    return application;
  }

  async update(id: string, userId: string, role: Role, dto: UpdateApplicationDto): Promise<Application> {
    const application = await this.findOne(id);
    if (role !== Role.ADMIN && application.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }
    await this.applicationRepository.update(id, dto);
    return this.findOne(id);
  }

  async addDocument(applicationId: string, userId: string, role: Role, dto: CreateDocumentDto): Promise<ApplicationDocument> {
    const application = await this.findOne(applicationId);
    if (role !== Role.ADMIN && application.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }
    const document = this.documentRepository.create({ ...dto, applicationId });
    return this.documentRepository.save(document);
  }

  async getDocuments(applicationId: string): Promise<ApplicationDocument[]> {
    await this.findOne(applicationId);
    return this.documentRepository.find({ where: { applicationId } });
  }

  async removeDocument(applicationId: string, documentId: string, userId: string, role: Role): Promise<void> {
    const application = await this.findOne(applicationId);
    if (role !== Role.ADMIN && application.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }
    await this.documentRepository.delete({ id: documentId, applicationId });
  }
}

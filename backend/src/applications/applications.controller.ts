import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { ApplicationsService } from './applications.service';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';
import { CreateDocumentDto } from './dto/create-document.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';

@ApiTags('applications')
@ApiBearerAuth()
@Controller('applications')
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  @Post()
  create(@CurrentUser() user: any, @Body() dto: CreateApplicationDto) {
    return this.applicationsService.create(user.id, dto);
  }

  @Get('my')
  getMyApplications(@CurrentUser('id') userId: string) {
    return this.applicationsService.getMyApplications(userId);
  }

  @Patch(':id')
  @Roles(Role.ADMIN)
  update(@Param('id') id: string, @CurrentUser() user: any, @Body() dto: UpdateApplicationDto) {
    return this.applicationsService.update(id, user.id, user.role, dto);
  }

  @Post(':id/documents')
  addDocument(
    @Param('id') id: string,
    @CurrentUser() user: any,
    @Body() dto: CreateDocumentDto,
  ) {
    return this.applicationsService.addDocument(id, user.id, user.role, dto);
  }

  @Get(':id/documents')
  getDocuments(@Param('id') id: string) {
    return this.applicationsService.getDocuments(id);
  }

  @Delete(':id/documents/:documentId')
  removeDocument(
    @Param('id') id: string,
    @Param('documentId') documentId: string,
    @CurrentUser() user: any,
  ) {
    return this.applicationsService.removeDocument(id, documentId, user.id, user.role);
  }
}

import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { ExhibitionsService } from './exhibitions.service';
import { CreateExhibitionDto } from './dto/create-exhibition.dto';
import { UpdateExhibitionDto } from './dto/update-exhibition.dto';
import { CreateProgramDto } from './dto/create-program.dto';
import { ExhibitionFilterDto } from './dto/exhibition-filter.dto';
import { Public } from '../common/decorators/public.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';

@ApiTags('exhibitions')
@ApiBearerAuth()
@Controller('exhibitions')
export class ExhibitionsController {
  constructor(private readonly exhibitionsService: ExhibitionsService) {}

  @Post()
  @Roles(Role.ADMIN)
  create(@Body() dto: CreateExhibitionDto) {
    return this.exhibitionsService.create(dto);
  }

  @Public()
  @Get()
  findAll(@Query() filter: ExhibitionFilterDto) {
    return this.exhibitionsService.findAll(filter);
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.exhibitionsService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN)
  update(@Param('id') id: string, @Body() dto: UpdateExhibitionDto) {
    return this.exhibitionsService.update(id, dto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  remove(@Param('id') id: string) {
    return this.exhibitionsService.remove(id);
  }

  @Post(':id/programs')
  @Roles(Role.ADMIN)
  addProgram(@Param('id') id: string, @Body() dto: CreateProgramDto) {
    return this.exhibitionsService.addProgram(id, dto);
  }

  @Public()
  @Get(':id/programs')
  getPrograms(@Param('id') id: string) {
    return this.exhibitionsService.getPrograms(id);
  }

  @Delete(':id/programs/:programId')
  @Roles(Role.ADMIN)
  removeProgram(@Param('id') id: string, @Param('programId') programId: string) {
    return this.exhibitionsService.removeProgram(id, programId);
  }

  @Post(':id/participants')
  @Roles(Role.ADMIN)
  addParticipant(@Param('id') id: string, @Body('companyId') companyId: string) {
    return this.exhibitionsService.addParticipant(id, companyId);
  }

  @Public()
  @Get(':id/participants')
  getParticipants(@Param('id') id: string) {
    return this.exhibitionsService.getParticipants(id);
  }

  @Delete(':id/participants/:participantId')
  @Roles(Role.ADMIN)
  removeParticipant(@Param('id') id: string, @Param('participantId') participantId: string) {
    return this.exhibitionsService.removeParticipant(id, participantId);
  }
}

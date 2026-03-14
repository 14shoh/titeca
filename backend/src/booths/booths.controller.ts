import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { BoothsService } from './booths.service';
import { CreateBoothDto } from './dto/create-booth.dto';
import { UpdateBoothDto } from './dto/update-booth.dto';
import { Public } from '../common/decorators/public.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';

@ApiTags('booths')
@ApiBearerAuth()
@Controller('exhibitions/:exhibitionId/booths')
export class BoothsController {
  constructor(private readonly boothsService: BoothsService) {}

  @Post()
  @Roles(Role.ADMIN)
  create(@Param('exhibitionId') exhibitionId: string, @Body() dto: CreateBoothDto) {
    return this.boothsService.create(exhibitionId, dto);
  }

  @Public()
  @Get()
  findAll(@Param('exhibitionId') exhibitionId: string) {
    return this.boothsService.findAll(exhibitionId);
  }

  @Public()
  @Get(':id')
  findOne(@Param('exhibitionId') exhibitionId: string, @Param('id') id: string) {
    return this.boothsService.findOne(exhibitionId, id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN)
  update(
    @Param('exhibitionId') exhibitionId: string,
    @Param('id') id: string,
    @Body() dto: UpdateBoothDto,
  ) {
    return this.boothsService.update(exhibitionId, id, dto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  remove(@Param('exhibitionId') exhibitionId: string, @Param('id') id: string) {
    return this.boothsService.remove(exhibitionId, id);
  }
}

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
import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Public } from '../common/decorators/public.decorator';

@ApiTags('companies')
@ApiBearerAuth()
@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Post()
  create(@CurrentUser() user: any, @Body() createCompanyDto: CreateCompanyDto) {
    return this.companiesService.create(user.id, createCompanyDto);
  }

  @Public()
  @Get()
  findAll(@Query() pagination: PaginationDto) {
    return this.companiesService.findAll(pagination);
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.companiesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @CurrentUser() user: any,
    @Body() updateCompanyDto: UpdateCompanyDto,
  ) {
    return this.companiesService.update(id, user.id, user.role, updateCompanyDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user: any) {
    return this.companiesService.remove(id, user.id, user.role);
  }

  @Post(':id/products')
  addProduct(
    @Param('id') id: string,
    @CurrentUser() user: any,
    @Body() dto: CreateProductDto,
  ) {
    return this.companiesService.addProduct(id, user.id, user.role, dto);
  }

  @Public()
  @Get(':id/products')
  getProducts(@Param('id') id: string) {
    return this.companiesService.getProducts(id);
  }

  @Delete(':id/products/:productId')
  removeProduct(
    @Param('id') id: string,
    @Param('productId') productId: string,
    @CurrentUser() user: any,
  ) {
    return this.companiesService.removeProduct(id, productId, user.id, user.role);
  }
}

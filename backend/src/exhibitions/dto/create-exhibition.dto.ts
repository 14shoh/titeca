import { IsObject, IsDateString, IsString, IsOptional, IsEnum, IsArray } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ExhibitionStatus } from '../../common/enums/exhibition-status.enum';
import { Industry } from '../../common/enums/industry.enum';

class I18nField {
  @IsOptional()
  @IsString()
  tj?: string;

  @IsOptional()
  @IsString()
  ru?: string;

  @IsOptional()
  @IsString()
  en?: string;
}

export class CreateExhibitionDto {
  @ApiProperty()
  @IsObject()
  @Type(() => I18nField)
  title: I18nField;

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  @Type(() => I18nField)
  description?: I18nField;

  @ApiProperty()
  @IsDateString()
  startDate: string;

  @ApiProperty()
  @IsDateString()
  endDate: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  location?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  country?: string;

  @ApiPropertyOptional({ enum: Industry })
  @IsOptional()
  @IsEnum(Industry)
  industry?: Industry;

  @ApiPropertyOptional({ enum: ExhibitionStatus })
  @IsOptional()
  @IsEnum(ExhibitionStatus)
  status?: ExhibitionStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  coverImage?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  mapImage?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  gallery?: string[];
}

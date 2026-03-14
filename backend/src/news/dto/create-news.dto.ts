import { IsObject, IsOptional, IsString, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

class I18nField {
  @IsOptional() @IsString() tj?: string;
  @IsOptional() @IsString() ru?: string;
  @IsOptional() @IsString() en?: string;
}

export class CreateNewsDto {
  @ApiProperty()
  @IsObject()
  @Type(() => I18nField)
  title: I18nField;

  @ApiProperty()
  @IsObject()
  @Type(() => I18nField)
  content: I18nField;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  image?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  author?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  publishedAt?: string;
}

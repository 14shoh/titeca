import { IsString, IsNumber, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { BoothStatus } from '../../common/enums/booth-status.enum';

export class CreateBoothDto {
  @ApiProperty()
  @IsString()
  number: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  size?: string;

  @ApiProperty()
  @Type(() => Number)
  @IsNumber()
  price: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  posX?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  posY?: number;

  @ApiPropertyOptional({ enum: BoothStatus })
  @IsOptional()
  @IsEnum(BoothStatus)
  status?: BoothStatus;
}

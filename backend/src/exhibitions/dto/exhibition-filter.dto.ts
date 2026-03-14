import { IsOptional, IsString, IsEnum, IsDateString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { Industry } from '../../common/enums/industry.enum';
import { ExhibitionStatus } from '../../common/enums/exhibition-status.enum';

export class ExhibitionFilterDto extends PaginationDto {
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
  city?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  endDate?: string;
}

import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

/** Interface tạo lịch sử */
export class HistoryCreateDto {
  @ApiProperty({ description: '' })
  @IsString()
  @IsNotEmpty()
  chapterId: string
}

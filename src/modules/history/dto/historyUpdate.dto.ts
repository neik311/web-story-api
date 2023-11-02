import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'
import { HistoryCreateDto } from './historyCreate.dto'

/** Interface cập nhật lịch sử */
export class HistoryUpdateDto extends HistoryCreateDto {
  @ApiProperty({ description: 'Id' })
  @IsString()
  @IsNotEmpty()
  id: string
}

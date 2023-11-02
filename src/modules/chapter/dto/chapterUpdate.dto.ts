import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'
import { ChapterCreateDto } from '.'

/** Interface cập nhật chapter */
export class ChapterUpdateDto extends ChapterCreateDto {
  @ApiProperty({ description: 'Id' })
  @IsString()
  @IsNotEmpty()
  id: string
}

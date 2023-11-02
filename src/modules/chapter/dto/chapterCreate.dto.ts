import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

/** Interface tạo chapter */
export class ChapterCreateDto {
  @ApiProperty({ description: '' })
  @IsNotEmpty()
  chapterNumber: number

  @ApiProperty({ description: '' })
  name: string

  @ApiProperty({ description: 'Tên' })
  @IsString()
  @IsNotEmpty()
  storyId: string

  @ApiProperty({ description: '' })
  @IsString()
  @IsNotEmpty()
  content: string
}

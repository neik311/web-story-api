import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

/** Interface tạo bình luận */
export class CommentCreateDto {
  @ApiProperty({ description: 'Tên' })
  @IsString()
  @IsNotEmpty()
  storyId: string

  @ApiProperty({ description: '' })
  @IsString()
  @IsNotEmpty()
  content: string

  @ApiProperty({ description: '' })
  parentId: string
}

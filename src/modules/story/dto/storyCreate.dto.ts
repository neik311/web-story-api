import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

/** Interface tạo mới truyện */
export class StoryCreateDto {
  @ApiProperty({ description: 'Tên' })
  @IsString()
  @IsNotEmpty()
  name: string

  @ApiProperty({ description: 'Tên khác' })
  otherName: string

  @ApiProperty({ description: 'Tác giả' })
  author: string

  @ApiProperty({ description: 'Nội dung' })
  content: string

  @ApiProperty({ description: 'Loại truyện' })
  type: string

  @ApiProperty({ description: 'Đã hoàn thành ?' })
  finished: boolean

  @ApiProperty({ description: '' })
  avatar: string

  @ApiProperty({ description: 'Danh sách id danh mục' })
  lstCategoryId: string[]
}

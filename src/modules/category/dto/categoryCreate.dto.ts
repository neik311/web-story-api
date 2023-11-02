import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

/** Interface tạo danh mục */
export class CategoryCreateDto {
  @ApiProperty({ description: 'Tên' })
  @IsString()
  @IsNotEmpty()
  name: string

  @ApiProperty({ description: '' })
  description: string
}

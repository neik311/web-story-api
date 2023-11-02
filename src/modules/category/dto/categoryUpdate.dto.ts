import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'
import { CategoryCreateDto } from './categoryCreate.dto'

/** Interface cập nhật danh mục */
export class CategoryUpdateDto extends CategoryCreateDto {
  @ApiProperty({ description: 'Id' })
  @IsString()
  @IsNotEmpty()
  id: string
}

import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

/** Interface tạo yeeu thích */
export class FavoriteCreateDto {
  @ApiProperty({ description: '' })
  @IsString()
  @IsNotEmpty()
  storyId: string
}

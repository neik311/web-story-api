import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'
import { StoryCreateDto } from './storyCreate.dto'

/** Interface cập nhật truyện */
export class StoryUpdateDto extends StoryCreateDto {
  @ApiProperty({ description: 'Id' })
  @IsString()
  @IsNotEmpty()
  id: string
}

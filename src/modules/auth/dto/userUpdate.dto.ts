import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'
import { UserCreateDto } from './userCreate.dto'

/**  */
export class UserUpdateDto {
  @ApiProperty({ description: 'Ảnh đại diện' })
  avatar: string
}

import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

/**  */
export class UserLoginDto {
  @ApiProperty({ description: '' })
  email: string

  @ApiProperty({ description: '' })
  username: string

  @ApiProperty({ description: '' })
  @IsString()
  @IsNotEmpty()
  password: string
}

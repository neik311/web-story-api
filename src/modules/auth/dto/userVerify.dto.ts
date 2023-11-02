import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

/**  */
export class UserVerifyDto {
  @ApiProperty({ description: '' })
  @IsString()
  @IsNotEmpty()
  email: string

  @ApiProperty({ description: '' })
  @IsString()
  @IsNotEmpty()
  code: string
}

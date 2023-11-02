import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

/** Interface gửi email xác thực. */
export class EmailVerifyDto {
  @ApiProperty({ description: '' })
  @IsNotEmpty()
  @IsString()
  email: string
}

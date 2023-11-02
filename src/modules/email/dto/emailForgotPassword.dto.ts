import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

/** Interface gửi email xác thực. */
export class EmailForgotPasswordDto {
  @ApiProperty({ description: '' })
  @IsNotEmpty()
  @IsString()
  email: string

  // @ApiProperty({ description: 'Mật khẩu mới' })
  // @IsNotEmpty()
  // @IsString()
  // password: string
}

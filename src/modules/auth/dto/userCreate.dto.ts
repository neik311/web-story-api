import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

/** Interface đăng ký tài khoản */
export class UserCreateDto {
  @ApiProperty({ description: 'Tài khoản' })
  @IsString()
  @IsNotEmpty()
  username: string

  @ApiProperty({ description: 'Mật khẩu' })
  @IsString()
  @IsNotEmpty()
  password: string

  @ApiProperty({ description: 'Email đăng ký tài khoản' })
  @IsString()
  @IsNotEmpty()
  email: string

  @ApiProperty({ description: 'Ảnh đại diện' })
  avatar: string
}

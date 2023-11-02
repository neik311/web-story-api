import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

/** Interface cập nhật mật khẩu */
export class UpdatePasswordDto {
  @ApiProperty({ description: 'Id user', example: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx' })
  @IsNotEmpty()
  @IsString()
  id: string

  @ApiProperty({ description: 'Mật khẩu mới', example: '123456789' })
  @IsString()
  newPassword: string
}

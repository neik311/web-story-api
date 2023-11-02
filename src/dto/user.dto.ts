import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsUUID } from 'class-validator'

/** Interface user */
export class UserDto {
  @ApiProperty({ description: 'Id user', example: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx' })
  @IsUUID()
  id: string

  @ApiProperty({ description: 'Tài khoản', example: 'userX' })
  @IsString()
  username: string

  @ApiProperty({ description: 'Loại tài khoản' })
  @IsString()
  roleCode: string
}

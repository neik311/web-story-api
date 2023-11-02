import { ApiProperty } from '@nestjs/swagger'

/** Interface tìm user */
export class UserFilterDto {
  @ApiProperty({ description: 'Danh sách Id tài khoản' })
  lstId?: string[]

  @ApiProperty({ description: 'Loại tài khoản' })
  type?: string
}

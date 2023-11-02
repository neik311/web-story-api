import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsUUID } from 'class-validator'

/** Interface Id */
export class FilterOneDto {
  @ApiProperty({ description: 'Id của đối tượng', example: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx' })
  @IsString()
  id: string
}

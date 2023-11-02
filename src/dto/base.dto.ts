import { IsUUID, IsString, IsDate, IsEmail } from 'class-validator'

export class BaseDto {
  @IsUUID()
  id: string

  @IsDate()
  createdAt: Date

  @IsDate()
  updatedAt: Date

  @IsString()
  createdBy: string

  @IsString()
  updatedBy: string 

}

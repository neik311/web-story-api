import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { ApiProperty } from '@nestjs/swagger'

/** Xác thực */
@Entity({ name: 'verify' })
export class VerifyEntity {
  /** Id khóa chính */
  @PrimaryGeneratedColumn('uuid')
  id: string

  @ApiProperty({ description: 'Email' })
  @Column({
    type: 'varchar',
    length: 250,
    nullable: false,
  })
  email: string

  @ApiProperty({ description: 'Mã xác thực' })
  @Column({
    type: 'varchar',
    length: 50,
    nullable: false,
  })
  code: string

  @ApiProperty({ description: 'Thời gian bắt đầu' })
  @Column({
    nullable: false,
  })
  timeStart: Date

  @ApiProperty({ description: 'Thời gian hết hạn' })
  @Column({
    nullable: false,
  })
  timeExpired: Date

  @ApiProperty({ description: 'Loại xác thực ( đăng ký / quên mật khẩu )' })
  @Column({
    type: 'varchar',
    length: 50,
    nullable: false,
  })
  type: string

  @ApiProperty({ description: '' })
  @Column({
    type: 'varchar',
    length: 500,
    nullable: true,
  })
  description: string
}

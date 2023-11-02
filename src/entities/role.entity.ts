import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm'
import { ApiProperty } from '@nestjs/swagger'

/** Vai trò */
@Entity({ name: 'role' })
export class RoleEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @ApiProperty({ description: 'code' })
  @Column({
    type: 'varchar',
    length: 50,
    nullable: false,
  })
  code: string

  @ApiProperty({ description: '' })
  @Column({
    type: 'varchar',
    length: 100,
    nullable: false,
  })
  name: string
}

import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm'
import { BaseEntity } from './base.entity'
import { ApiProperty } from '@nestjs/swagger'

/** Danh mục */
@Entity({ name: 'category' })
export class CategoryEntity extends BaseEntity {
  @ApiProperty({ description: 'Tên' })
  @Column({
    type: 'varchar',
    length: 250,
    nullable: false,
  })
  name: string

  @ApiProperty({ description: '' })
  @Column({
    type: 'varchar',
    length: 500,
    nullable: true,
  })
  description: string
}

import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm'
import { BaseEntity } from './base.entity'
import { ApiProperty } from '@nestjs/swagger'
import { UserEntity } from '.'

/** Tin nhắn */
@Entity({ name: 'message' })
export class MessageEntity extends BaseEntity {
  @ApiProperty({ description: '' })
  @Column({
    type: 'varchar',
    length: 36,
    nullable: false,
  })
  userId: string
  @ManyToOne(() => UserEntity, (p) => p.id)
  @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
  user: Promise<UserEntity>

  @ApiProperty({ description: '' })
  @Column({
    type: 'varchar',
    length: 500,
    nullable: true,
  })
  content: string
}

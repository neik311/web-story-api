import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm'
import { BaseEntity } from './base.entity'
import { ApiProperty } from '@nestjs/swagger'
import { ChapterEntity, StoryEntity, UserEntity } from '.'

/** Lịch sử */
@Entity({ name: 'history' })
export class HistoryEntity extends BaseEntity {
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
    length: 36,
    nullable: false,
  })
  chapterId: string
  @ManyToOne(() => ChapterEntity, (p) => p.id)
  @JoinColumn({ name: 'chapterId', referencedColumnName: 'id' })
  chapter: Promise<ChapterEntity>
}

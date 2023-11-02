import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm'
import { BaseEntity } from './base.entity'
import { ApiProperty } from '@nestjs/swagger'
import { ChapterEntity, StoryEntity, UserEntity } from '.'

/** Bình luận */
@Entity({ name: 'comment' })
export class CommentEntity extends BaseEntity {
  @ApiProperty({ description: '' })
  @Column({
    type: 'varchar',
    length: 36,
    nullable: false,
  })
  storyId: string
  @ManyToOne(() => StoryEntity, (p) => p.id)
  @JoinColumn({ name: 'storyId', referencedColumnName: 'id' })
  story: Promise<StoryEntity>

  @ApiProperty({ description: '' })
  @Column({
    type: 'varchar',
    length: 36,
    nullable: true,
  })
  chapterId: string
  @ManyToOne(() => ChapterEntity, (p) => p.id)
  @JoinColumn({ name: 'chapterId', referencedColumnName: 'id' })
  chapter: Promise<ChapterEntity>

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

  /** Bình luận cha */
  @Column({
    type: 'varchar',
    length: 36,
    nullable: true,
  })
  parentId: string
  @ManyToOne(() => CommentEntity, (p) => p.children)
  @JoinColumn({ name: 'parentId', referencedColumnName: 'id' })
  parent: CommentEntity

  /** ds bình luận con - 1 bình luận cha sẽ có thể có nhiều con */
  @OneToMany(() => CommentEntity, (p) => p.parent)
  children: Promise<CommentEntity[]>
}

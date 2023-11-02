import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm'
import { BaseEntity } from './base.entity'
import { ApiProperty } from '@nestjs/swagger'
import { enumData } from '../constants'
import { CategoryStoryEntity, ChapterEntity, CommentEntity, FavoriteEntity } from '.'

/** Truyện */
@Entity({ name: 'story' })
export class StoryEntity extends BaseEntity {
  @ApiProperty({ description: 'Tên' })
  @Column({
    type: 'varchar',
    length: 250,
    nullable: false,
  })
  name: string

  @ApiProperty({ description: 'Tên khác' })
  @Column({
    type: 'varchar',
    length: 250,
    nullable: true,
  })
  otherName: string

  @ApiProperty({ description: 'Tác giả' })
  @Column({
    type: 'varchar',
    length: 250,
    nullable: true,
  })
  author: string

  @ApiProperty({ description: 'avatar' })
  @Column({
    type: 'varchar',
    length: 500,
    nullable: false,
  })
  avatar: string

  @ApiProperty({ description: '' })
  @Column({
    type: 'text',
    nullable: true,
  })
  content: string

  @ApiProperty({ description: 'Đã hoàn thành ?' })
  @Column({
    nullable: true,
    default: false,
  })
  finished: boolean

  @ApiProperty({ description: 'Loại truyện (chữ / tranh )' })
  @Column({
    type: 'varchar',
    length: 50,
    nullable: false,
    default: enumData.StoryType.word.code,
  })
  type: string

  /** Danh sách chapter */
  @OneToMany(() => ChapterEntity, (p) => p.story)
  chapters: Promise<ChapterEntity[]>

  /** Danh sách bình luận */
  @OneToMany(() => CommentEntity, (p) => p.story)
  comments: Promise<CommentEntity[]>

  /** Danh sách yêu thích */
  @OneToMany(() => FavoriteEntity, (p) => p.story)
  favorites: Promise<FavoriteEntity[]>

  /** Danh sách danh mục */
  @OneToMany(() => CategoryStoryEntity, (p) => p.story)
  categoryStory: Promise<CategoryStoryEntity[]>
}

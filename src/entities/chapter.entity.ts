import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm'
import { BaseEntity } from './base.entity'
import { ApiProperty } from '@nestjs/swagger'
import { StoryEntity } from '.'

/** Chương */
@Entity({ name: 'chapter' })
export class ChapterEntity extends BaseEntity {
  @ApiProperty({ description: '' })
  @Column({
    type: 'float',
    nullable: false,
  })
  chapterNumber: number

  @ApiProperty({ description: 'Tên' })
  @Column({
    type: 'varchar',
    length: 250,
    nullable: true,
  })
  name: string

  @ApiProperty({ description: '' })
  @Column({
    type: 'text',
    nullable: true,
  })
  content: string

  @ApiProperty({ description: '' })
  @Column({
    type: 'integer',
    nullable: true,
    default: 0,
  })
  viewCount: number

  @ApiProperty({ description: '' })
  @Column({
    type: 'varchar',
    length: 36,
    nullable: false,
  })
  storyId: string
  @ManyToOne(() => StoryEntity, (p) => p.chapters)
  @JoinColumn({ name: 'storyId', referencedColumnName: 'id' })
  story: Promise<StoryEntity>
}

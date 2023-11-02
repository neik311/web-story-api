import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm'
import { BaseEntity } from './base.entity'
import { ApiProperty } from '@nestjs/swagger'
import { CategoryEntity, StoryEntity } from '.'

/** Danh mục - truyện */
@Entity({ name: 'category_story' })
export class CategoryStoryEntity extends BaseEntity {
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
    nullable: false,
  })
  categoryId: string
  @ManyToOne(() => CategoryEntity, (p) => p.id)
  @JoinColumn({ name: 'categoryId', referencedColumnName: 'id' })
  category: Promise<CategoryEntity>
}

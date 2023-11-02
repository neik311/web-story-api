import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm'
import { BaseEntity } from './base.entity'
import { ApiProperty } from '@nestjs/swagger'
import { StoryEntity, UserEntity } from '.'

/** Yêu thích */
@Entity({ name: 'favorite' })
export class FavoriteEntity extends BaseEntity {
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
  userId: string
  @ManyToOne(() => UserEntity, (p) => p.id)
  @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
  user: Promise<UserEntity>
}

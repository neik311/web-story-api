import { Repository } from 'typeorm'
import { CategoryStoryEntity, StoryEntity } from '../entities'
import { CustomRepository } from '../typeorm'

@CustomRepository(StoryEntity)
export class StoryRepository extends Repository<StoryEntity> {}

@CustomRepository(CategoryStoryEntity)
export class CategoryStoryRepository extends Repository<CategoryStoryEntity> {}

import { Repository } from 'typeorm'
import { CategoryEntity, UserEntity } from '../entities'
import { CustomRepository } from '../typeorm'

@CustomRepository(CategoryEntity)
export class CategoryRepository extends Repository<CategoryEntity> {}

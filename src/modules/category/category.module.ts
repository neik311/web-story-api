import { Module } from '@nestjs/common'
import { CategoryService } from './category.service'
import { TypeOrmExModule } from '../../typeorm'
import { CategoryRepository, CategoryStoryRepository } from '../../repositories'
import { CategoryController } from './category.controller'

@Module({
  imports: [TypeOrmExModule.forCustomRepository([CategoryRepository, CategoryStoryRepository])],
  providers: [CategoryService],
  controllers: [CategoryController],
  exports: [CategoryService],
})
export class CategoryModule {}

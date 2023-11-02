import { Module } from '@nestjs/common'
import { StoryService } from './story.service'
import { TypeOrmExModule } from '../../typeorm'
import { CategoryRepository, CategoryStoryRepository, StoryRepository, HistoryRepository, ChapterRepository } from '../../repositories'
import { StoryController } from './story.controller'

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([StoryRepository, CategoryRepository, CategoryStoryRepository, HistoryRepository, ChapterRepository]),
  ],
  providers: [StoryService],
  controllers: [StoryController],
  exports: [StoryService],
})
export class StoryModule {}

import { Module } from '@nestjs/common'
import { TypeOrmExModule } from '../../typeorm'
import { HistoryRepository, ChapterRepository, StoryRepository } from '../../repositories'
import { HistoryService } from './history.service'
import { HistoryController } from './history.controller'

@Module({
  imports: [TypeOrmExModule.forCustomRepository([StoryRepository, HistoryRepository, ChapterRepository])],
  providers: [HistoryService],
  controllers: [HistoryController],
  exports: [HistoryService],
})
export class HistoryModule {}

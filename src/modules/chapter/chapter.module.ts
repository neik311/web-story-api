import { Module } from '@nestjs/common'
import { TypeOrmExModule } from '../../typeorm'
import { ChapterRepository, StoryRepository } from '../../repositories'
import { ChapterService } from './chapter.service'
import { ChapterController } from './chapter.controller'

@Module({
  imports: [TypeOrmExModule.forCustomRepository([ChapterRepository, StoryRepository])],
  providers: [ChapterService],
  controllers: [ChapterController],
  exports: [ChapterService],
})
export class ChapterModule {}

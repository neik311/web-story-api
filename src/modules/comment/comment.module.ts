import { Module } from '@nestjs/common'
import { CommentService } from './comment.service'
import { TypeOrmExModule } from '../../typeorm'
import { CommentRepository, StoryRepository, UserRepository } from '../../repositories'
import { CommentController } from './comment.controller'

@Module({
  imports: [TypeOrmExModule.forCustomRepository([CommentRepository, StoryRepository, UserRepository])],
  providers: [CommentService],
  controllers: [CommentController],
  exports: [CommentService],
})
export class CommentModule {}

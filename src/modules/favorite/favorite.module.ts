import { Module } from '@nestjs/common'
import { TypeOrmExModule } from '../../typeorm'
import { FavoriteRepository, StoryRepository } from '../../repositories'
import { FavoriteService } from './favorite.service'
import { FavoriteController } from './favorite.controller'

@Module({
  imports: [TypeOrmExModule.forCustomRepository([StoryRepository, FavoriteRepository])],
  providers: [FavoriteService],
  controllers: [FavoriteController],
  exports: [FavoriteService],
})
export class FavoriteModule {}

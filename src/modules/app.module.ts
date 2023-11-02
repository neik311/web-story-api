import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config/dist/config.module'
import { APP_INTERCEPTOR } from '@nestjs/core'
import { ScheduleModule } from '@nestjs/schedule'
import { TrimInterceptor } from '../interceptores'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { AuthModule } from './auth/auth.module'
import { EmailModule } from './email/email.module'
import { CategoryModule } from './category/category.module'
import { CommentModule } from './comment/comment.module'
import { StoryModule } from './story/story.module'
import { HistoryModule } from './history/history.module'
import { FavoriteModule } from './favorite/favorite.module'
import { ChapterModule } from './chapter/chapter.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ScheduleModule.forRoot(),
    AuthModule,
    EmailModule,
    CategoryModule,
    CommentModule,
    StoryModule,
    HistoryModule,
    FavoriteModule,
    ChapterModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: TrimInterceptor,
    },
  ],
})
export class AppModule {}

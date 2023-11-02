import { NestFactory } from '@nestjs/core'
import { ConfigService } from '@nestjs/config'
import { ValidationPipe } from '@nestjs/common'
import rateLimit from 'express-rate-limit'
import { AppModule } from './modules/app.module'
import { json, urlencoded } from 'express'
import { AllExceptionsFilter } from './modules/common/filters'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { NestExpressApplication } from '@nestjs/platform-express'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)
  const configService = app.get(ConfigService)
  const port = configService.get<string>('PORT')
  app.enableCors()
  app.use(
    rateLimit({
      windowMs: 1 * 60 * 1000, // 1 minutes
      max: 100000, // limit each IP to 100,000 requests per windowMs
    }),
  )

  app.use(json({ limit: '10mb' }))
  app.use(urlencoded({ extended: true, limit: '10mb' }))

  app.useGlobalPipes(new ValidationPipe({ transform: true }))
  app.useGlobalFilters(new AllExceptionsFilter())

  const options = new DocumentBuilder().setTitle('Document API').setVersion('').addBearerAuth().build()
  const document = SwaggerModule.createDocument(app, options)
  SwaggerModule.setup('api', app, document)

  await app.listen(port || 3200)
  console.log(`Application is running on: ${await app.getUrl()}`)
}
bootstrap()

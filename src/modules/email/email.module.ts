import { Module } from '@nestjs/common'
import { EmailService } from './email.service'
import { TypeOrmExModule } from '../../typeorm'
import { VerifyRepository } from '../../repositories'
import { EmailController } from './email.controller'

@Module({
  imports: [TypeOrmExModule.forCustomRepository([VerifyRepository])],
  providers: [EmailService],
  controllers: [EmailController],
  exports: [EmailService],
})
export class EmailModule {}

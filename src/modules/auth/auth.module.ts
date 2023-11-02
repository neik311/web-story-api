import { VerifyRepository } from './../../repositories/verify.repository'
import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { PassportModule } from '@nestjs/passport'
import { JwtModule } from '@nestjs/jwt'
import { TypeOrmExModule } from '../../typeorm'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { RoleRepository, UserRepository } from '../../repositories'
import { AdminStrategy } from './admin.strategy'
import { EmailModule } from '../email/email.module'
import { UserStrategy } from './user.strategy'

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: configService.get<string>('JWT_EXPIRY') },
      }),
    }),
    TypeOrmExModule.forCustomRepository([UserRepository, RoleRepository, VerifyRepository]),
    EmailModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, AdminStrategy, UserStrategy],
  exports: [AuthService],
})
export class AuthModule {}

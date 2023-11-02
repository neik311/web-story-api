import { Body, Controller, Post } from '@nestjs/common'
import { EmailForgotPasswordDto, EmailVerifyDto } from './dto'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { EmailService } from './email.service'

@ApiBearerAuth()
@ApiTags('Email')
@Controller('email')
export class EmailController {
  constructor(private readonly service: EmailService) {}

  @ApiOperation({ summary: 'Gửi email xác thực đăng ký tài khoản' })
  @Post('send_verify_email')
  public async sendVerify(@Body() data: EmailVerifyDto) {
    return await this.service.sendEmailVerify(data)
  }

  @ApiOperation({ summary: 'Gửi email xác thực quên mật khẩu' })
  @Post('send_forgot_password')
  public async sendForgotPassword(@Body() data: EmailVerifyDto) {
    return await this.service.sendEmailForgotPassword(data)
  }
}

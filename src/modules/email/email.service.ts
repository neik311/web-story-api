'use strict'
const nodemailer = require('nodemailer')
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { customAlphabet } from 'nanoid'
import { enumData } from '../../constants'
import { VerifyRepository } from '../../repositories'
import { EmailForgotPasswordDto, EmailVerifyDto } from './dto'
import { VerifyEntity } from '../../entities'
const nanoid = customAlphabet('1234567890', 4)

@Injectable()
export class EmailService {
  private smtpEndpoint: string

  // The port to use when connecting to the SMTP server.
  private port: number

  private currentUrl: string

  private senderAddress: string

  private senderPassword: string

  constructor(private readonly configService: ConfigService, private readonly verifyRepo: VerifyRepository) {
    this.smtpEndpoint = 'smtp.gmail.com'

    this.port = 587

    this.currentUrl = this.configService.get<string>('SERVER_URL')

    this.senderAddress = this.configService.get<string>('EMAIL_VALIDATE_ACCOUNT')

    this.senderPassword = this.configService.get<string>('EMAIL_VALIDATE_PASSWORD')
  }

  /** Gửi email xác thực đăng ký tài khoản */
  public async sendEmailVerify(data: EmailVerifyDto) {
    const transporter = await nodemailer.createTransport({
      host: this.smtpEndpoint,
      port: this.port,
      secure: false, // true for 465, false for other ports
      auth: {
        user: this.senderAddress,
        pass: this.senderPassword,
      },
    })

    const code = nanoid()

    // Specify the fields in the email.
    const mailOptions = {
      from: this.senderAddress,
      to: data.email,
      subject: 'Xác minh đăng ký tài khoản',
      html: `<div style="display: flex; margin: 0 auto; justify-content: center; align-items: center; height: 100vh; font-family: Arial, Helvetica, sans-serif; box-sizing: border-box;">
    <div style="width: 600px; padding: 20px 8%; text-align: center; background-color: #fff; border-radius: 12px; color: #333;">
        <p style="font-size: 18px; color: #888;">Cảm ơn bạn đã đăng ký</p>
        <img src="https://i.pinimg.com/originals/ff/d2/c2/ffd2c238fb713dbf7872626b493f2a81.jpg" alt="email" width="300px">
        <h1>Xác minh địa chỉ email của bạn</h1>
        <p>Xác minh địa chỉ email của bạn để hoàn tất đăng ký và đăng nhập tài khoản của bạn.</p>
        <p>Mã xác minh của bạn là <b>${code}</b></p>
        <p>Mã xác minh có hiệu lực trong 5 phút</p>
    </div>
</div>`,
    }
    await transporter.sendMail(mailOptions)
    const newVerify = new VerifyEntity()
    newVerify.email = data.email
    newVerify.code = code
    newVerify.timeStart = new Date()
    newVerify.timeExpired = new Date(new Date().getTime() + Number(this.configService.get<number>('TIME_EFFECTIVE')))
    newVerify.type = enumData.VerifyEmailType.Register.code
    await this.verifyRepo.save(newVerify)
  }

  /** Email quên mật khẩu */
  public async sendEmailForgotPassword(data: EmailForgotPasswordDto) {
    const transporter = await nodemailer.createTransport({
      host: this.smtpEndpoint,
      port: this.port,
      secure: false, // true for 465, false for other ports
      auth: {
        user: this.senderAddress,
        pass: this.senderPassword,
      },
    })

    const code = nanoid()

    // Specify the fields in the email.
    const mailOptions = {
      from: this.senderAddress,
      to: data.email,
      subject: 'Thư xác nhận mật khẩu',
      html: `<div style="display: flex; margin: 0 auto; justify-content: center; align-items: center; height: 100vh; font-family: Arial, Helvetica, sans-serif; box-sizing: border-box;">
      <div style="width: 600px; padding: 20px 8%; text-align: center; background-color: #fff; border-radius: 12px; color: #333;">
          <p style="font-size: 18px; color: #888;">Xác nhận mật khẩu</p>
          <img src="https://i.pinimg.com/originals/ff/d2/c2/ffd2c238fb713dbf7872626b493f2a81.jpg" alt="email" width="300px">
          <h1>Xác nhận thay đổi mật khẩu</h1>
          <p>Bạn đã yêu cầu quên mật khẩu và đổi mật khẩu mới</p>
          <p>Mã xác minh của bạn là <b>${code}</b></p>
          <p>Mã xác minh có hiệu lực trong 5 phút</p>
      </div>
  </div>`,
    }
    // Send the email.
    await transporter.sendMail(mailOptions)
    const newVerify = new VerifyEntity()
    newVerify.email = data.email
    newVerify.code = code
    newVerify.timeStart = new Date()
    newVerify.timeExpired = new Date(new Date().getTime() + Number(this.configService.get<number>('TIME_EFFECTIVE')))
    newVerify.type = enumData.VerifyEmailType.ForgotPassword.code
    await this.verifyRepo.save(newVerify)
  }
}

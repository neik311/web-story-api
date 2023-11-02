import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { AuthService } from './auth.service'
import { UserForgotPasswordDto, UserVerifyDto, UserLoginDto, UserCreateDto, UserUpdateDto } from './dto'
import { JwtAuthGuard, UserAuthGuard } from '../common/guards'
import { CurrentUser } from '../common/decorators'
import { FilterOneDto, PaginationDto, UserDto } from '../../dto'

// @ApiBearerAuth()
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly service: AuthService) {}

  @ApiOperation({ summary: 'Đăng ký tài khoản' })
  @Post('register')
  public async register(@Body() data: UserCreateDto) {
    return await this.service.register(data)
  }

  @ApiOperation({ summary: 'Đăng nhập' })
  @Post('login')
  public async login(@Body() data: UserLoginDto) {
    return await this.service.login(data)
  }

  @ApiOperation({ summary: 'Xác thực email đăng ký' })
  @Post('verify')
  public async verify(@Body() data: UserVerifyDto) {
    return await this.service.verified(data)
  }

  @ApiOperation({ summary: 'Quên mật khẩu' })
  @Post('forgot-password')
  public async forgotPassword(@Body() data: UserForgotPasswordDto) {
    return await this.service.verifiedForgotPassword(data)
  }

  @ApiOperation({ summary: 'Lấy thông tin user' })
  @UseGuards(UserAuthGuard)
  @Post('get_info_user')
  public async getInfoUser(@CurrentUser() user: UserDto) {
    return await this.service.getInfoUser(user)
  }

  @ApiOperation({ summary: 'Lấy danh sách người dùng (phân trang)' })
  @UseGuards(JwtAuthGuard)
  @Post('pagination')
  public async pagination(@Body() data: PaginationDto) {
    return await this.service.pagination(data)
  }

  @ApiOperation({ summary: 'Cập nhật trạng thái' })
  @UseGuards(JwtAuthGuard)
  @Post('update_active')
  public async updateActive(@CurrentUser() user: UserDto, @Body() data: FilterOneDto) {
    return await this.service.updateActive(user, data)
  }

  @ApiOperation({ summary: 'Cập nhật ' })
  @UseGuards(UserAuthGuard)
  @Post('update_data')
  public async updateData(@CurrentUser() user: UserDto, @Body() data: UserUpdateDto) {
    return await this.service.updateData(user, data)
  }
}

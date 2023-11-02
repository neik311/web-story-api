import { Controller, UseGuards, Post, Body } from '@nestjs/common'
import { JwtAuthGuard, UserAuthGuard } from '../common/guards'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { FavoriteCreateDto } from './dto'
import { CurrentUser } from '../common/decorators'
import { FilterOneDto, PaginationDto, UserDto } from '../../dto'
import { FavoriteService } from './favorite.service'

@ApiBearerAuth()
@ApiTags('Favorite')
@Controller('favorite')
export class FavoriteController {
  constructor(private readonly service: FavoriteService) {}

  @ApiOperation({ summary: 'Lấy danh sách yêu thích theo phân trang' })
  @UseGuards(UserAuthGuard)
  @Post('get_all')
  public async pagination(@CurrentUser() user: UserDto, @Body() data: PaginationDto) {
    return await this.service.getFavoriteByUser(user, data)
  }

  @ApiOperation({ summary: 'Tạo mới' })
  @UseGuards(UserAuthGuard)
  @Post('create_data')
  public async createData(@CurrentUser() user: UserDto, @Body() data: FavoriteCreateDto) {
    return await this.service.createData(user, data)
  }

  @ApiOperation({ summary: 'Xóa yêu thích' })
  @UseGuards(UserAuthGuard)
  @Post('update_active')
  public async updateActive(@CurrentUser() user: UserDto, @Body() data: FavoriteCreateDto) {
    return await this.service.deleteFavorite(user, data)
  }
}

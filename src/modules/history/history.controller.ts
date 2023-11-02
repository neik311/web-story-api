import { Controller, UseGuards, Post, Body } from '@nestjs/common'
import { HistoryService } from './history.service'
import { HistoryCreateDto } from './dto'
import { CurrentUser } from '../common/decorators'
import { FilterOneDto, PaginationDto, UserDto } from '../../dto'
import { JwtAuthGuard, UserAuthGuard } from '../common/guards'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'

@ApiBearerAuth()
@ApiTags('History')
@Controller('history')
export class HistoryController {
  constructor(private readonly service: HistoryService) {}

  @ApiOperation({ summary: 'Lấy danh sách lịch sử theo phân trang' })
  @UseGuards(UserAuthGuard)
  @Post('get_all')
  public async pagination(@CurrentUser() user: UserDto, @Body() data: PaginationDto) {
    return await this.service.getHistoryByUser(user, data)
  }

  @ApiOperation({ summary: 'Tạo mới' })
  @UseGuards(UserAuthGuard)
  @Post('create_data')
  public async createData(@CurrentUser() user: UserDto, @Body() data: HistoryCreateDto) {
    return await this.service.createData(user, data)
  }

  @ApiOperation({ summary: 'Cập nhật trạng thái' })
  @UseGuards(UserAuthGuard)
  @Post('update_active')
  public async updateActive(@CurrentUser() user: UserDto, @Body() data: FilterOneDto) {
    return await this.service.deleteHistory(user, data)
  }
}

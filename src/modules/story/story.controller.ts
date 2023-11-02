import { Controller, UseGuards, Post, Body } from '@nestjs/common'
import { StoryService } from './story.service'
import { StoryCreateDto, StoryUpdateDto } from './dto'
import { CurrentUser } from '../common/decorators'
import { FilterOneDto, PaginationDto, UserDto } from '../../dto'
import { JwtAuthGuard, UserAuthGuard } from '../common/guards'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'

@ApiBearerAuth()
@ApiTags('Story')
@Controller('story')
export class StoryController {
  constructor(private readonly service: StoryService) {}

  @ApiOperation({ summary: 'Lấy danh sách truyện (phân trang)' })
  @Post('pagination')
  public async pagination(@Body() data: PaginationDto) {
    return await this.service.pagination(data)
  }

  @ApiOperation({ summary: 'Lấy chi tiết một truyện' })
  @Post('get_story')
  public async getStory(@Body() data: FilterOneDto) {
    return await this.service.getStory(data)
  }

  @ApiOperation({ summary: 'Tạo mới truyện' })
  @UseGuards(JwtAuthGuard)
  @Post('create_data')
  public async createData(@CurrentUser() user: UserDto, @Body() data: StoryCreateDto) {
    return await this.service.createData(user, data)
  }

  @ApiOperation({ summary: 'Cập nhật truyện' })
  @UseGuards(JwtAuthGuard)
  @Post('update_data')
  public async updateData(@CurrentUser() user: UserDto, @Body() data: StoryUpdateDto) {
    return await this.service.updateData(user, data)
  }

  @ApiOperation({ summary: 'Cập nhật trạng thái' })
  @UseGuards(JwtAuthGuard)
  @Post('update_active')
  public async updateActive(@CurrentUser() user: UserDto, @Body() data: FilterOneDto) {
    return await this.service.updateActive(user, data)
  }
}

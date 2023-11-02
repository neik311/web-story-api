import { Controller, UseGuards, Post, Body } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { ChapterCreateDto, ChapterUpdateDto } from './dto'
import { CurrentUser } from '../common/decorators'
import { FilterOneDto, PaginationDto, UserDto } from '../../dto'
import { JwtAuthGuard, UserAuthGuard } from '../common/guards'
import { ChapterService } from './chapter.service'

@ApiBearerAuth()
@ApiTags('Chapter')
@Controller('chapter')
export class ChapterController {
  constructor(private readonly service: ChapterService) {}

  @ApiOperation({ summary: 'Lấy danh sách chapter (phân trang)' })
  @UseGuards(UserAuthGuard)
  @Post('pagination')
  public async pagination(@Body() data: PaginationDto) {
    return await this.service.pagination(data)
  }

  @ApiOperation({ summary: 'Lấy danh sách chapter theo truyện' })
  @Post('get_chapter_by_story')
  public async getChapterByStory(@Body() data: FilterOneDto) {
    return await this.service.getAllChapterByStory(data)
  }

  @ApiOperation({ summary: 'Lấy danh sách chapter để in' })
  @Post('get_chapter_print')
  public async getAllChapterOrderPrint(@Body() data: FilterOneDto) {
    return await this.service.getAllChapterOrderPrint(data)
  }

  @ApiOperation({ summary: 'Lấy chi tiết một chapter' })
  @Post('get_chapter_by_id')
  public async getChapterById(@Body() data: FilterOneDto) {
    return await this.service.getChapterById(data)
  }

  @ApiOperation({ summary: 'Tạo mới chapter' })
  @UseGuards(UserAuthGuard)
  @Post('create_data')
  public async createData(@CurrentUser() user: UserDto, @Body() data: ChapterCreateDto) {
    return await this.service.createData(user, data)
  }

  @ApiOperation({ summary: 'Cập nhật chapter' })
  @UseGuards(JwtAuthGuard)
  @Post('update_data')
  public async updateData(@CurrentUser() user: UserDto, @Body() data: ChapterUpdateDto) {
    return await this.service.updateData(user, data)
  }

  @ApiOperation({ summary: 'Cập nhật trạng thái' })
  @UseGuards(JwtAuthGuard)
  @Post('update_active')
  public async updateActive(@CurrentUser() user: UserDto, @Body() data: FilterOneDto) {
    return await this.service.updateActive(user, data)
  }

  @ApiOperation({ summary: 'Tăng view chapter' })
  @Post('plus_view_chapter')
  public async plusViewChapter(@Body() data: FilterOneDto) {
    return await this.service.plusViewCountChapter(data)
  }
}

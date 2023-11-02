import { Controller, UseGuards, Post, Body } from '@nestjs/common'
import { CommentService } from './comment.service'
import { CommentCreateDto, CommentUpdateDto } from './dto'
import { CurrentUser } from '../common/decorators'
import { FilterOneDto, PaginationDto, UserDto } from '../../dto'
import { JwtAuthGuard, UserAuthGuard } from '../common/guards'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'

@ApiBearerAuth()
@ApiTags('Comment')
@Controller('comment')
export class CommentController {
  constructor(private readonly service: CommentService) {}

  @ApiOperation({ summary: 'Lấy danh sách bình luận (phân trang)' })
  @Post('pagination')
  public async pagination(@Body() data: PaginationDto) {
    return await this.service.pagination(data)
  }

  @ApiOperation({ summary: 'Tạo mới bình luận' })
  @UseGuards(UserAuthGuard)
  @Post('create_data')
  public async createData(@CurrentUser() user: UserDto, @Body() data: CommentCreateDto) {
    return await this.service.createData(user, data)
  }

  @ApiOperation({ summary: 'Cập nhật bình luận' })
  @UseGuards(JwtAuthGuard)
  @Post('update_data')
  public async updateData(@CurrentUser() user: UserDto, @Body() data: CommentUpdateDto) {
    return await this.service.updateData(user, data)
  }

  @ApiOperation({ summary: 'Cập nhật trạng thái' })
  @UseGuards(JwtAuthGuard)
  @Post('update_active')
  public async updateActive(@CurrentUser() user: UserDto, @Body() data: FilterOneDto) {
    return await this.service.updateActive(user, data)
  }
}

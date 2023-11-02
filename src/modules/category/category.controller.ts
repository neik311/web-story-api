import { Controller, UseGuards, Post, Body } from '@nestjs/common'
import { CategoryService } from './category.service'
import { CategoryCreateDto, CategoryUpdateDto } from './dto'
import { CurrentUser } from '../common/decorators'
import { FilterOneDto, PaginationDto, UserDto } from '../../dto'
import { JwtAuthGuard, UserAuthGuard } from '../common/guards'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'

@ApiBearerAuth()
@ApiTags('Category')
@Controller('category')
export class CategoryController {
  constructor(private readonly service: CategoryService) {}

  @ApiOperation({ summary: 'Lấy danh sách danh mục (phân trang)' })
  @Post('pagination')
  public async pagination(@Body() data: PaginationDto) {
    return await this.service.pagination(data)
  }

  @ApiOperation({ summary: 'Tạo mới danh mục' })
  @UseGuards(JwtAuthGuard)
  @Post('create_data')
  public async createData(@CurrentUser() user: UserDto, @Body() data: CategoryCreateDto) {
    return await this.service.createData(user, data)
  }

  @ApiOperation({ summary: 'Cập nhật danh mục' })
  @UseGuards(JwtAuthGuard)
  @Post('update_data')
  public async updateData(@CurrentUser() user: UserDto, @Body() data: CategoryUpdateDto) {
    return await this.service.updateData(user, data)
  }

  @ApiOperation({ summary: 'Cập nhật trạng thái' })
  @UseGuards(JwtAuthGuard)
  @Post('update_active')
  public async updateActive(@CurrentUser() user: UserDto, @Body() data: FilterOneDto) {
    return await this.service.updateActive(user, data)
  }
}

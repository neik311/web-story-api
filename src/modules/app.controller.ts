import { Controller, Get } from '@nestjs/common'
import { AppService } from './app.service'
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'

@ApiBearerAuth()
@ApiTags('')
@Controller()
export class AppController {
  constructor(private readonly service: AppService) {}

  @ApiOperation({ summary: 'Kiểm tra tình trạng server' })
  @ApiResponse({ status: 200, description: 'Trả về tình trạng server' })
  @Get('healthcheck')
  healthCheck() {
    return this.service.healthCheck()
  }
}

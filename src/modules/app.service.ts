import { Injectable } from '@nestjs/common'
import { coreHelper } from '../helpers'

@Injectable()
export class AppService {
  /** Kiểm tra tình trạng server */
  healthCheck() {
    return 'This server is healthy.'
  }
}

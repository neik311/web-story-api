import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common'

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    console.log(exception)
    const ctx = host.switchToHttp()
    const response = ctx.getResponse()
    const request = ctx.getRequest()

    if (exception instanceof HttpException) {
      const status = exception.getStatus()

      let message: any = exception.message
      const name = exception.name

      if (message === 'INTERNAL_SERVER_ERROR' && exception.message) {
        message = exception.message
      } else if (message.message) {
        message = message.message
      }

      if (status == HttpStatus.UNAUTHORIZED && message == 'Unauthorized') {
        if (response?.req?.authInfo?.name == 'TokenExpiredError') {
          message = 'Hết phiên đăng nhập, vui lòng đăng nhập lại để tiếp tục.'
        }
      }

      /** return message validator dto */
      if (status === HttpStatus.BAD_REQUEST && JSON.parse(JSON.stringify(exception.getResponse())).message.length > 0) {
        message = JSON.parse(JSON.stringify(exception.getResponse())).message.join(', ')
      }

      response.status(status).json({
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url,
        message: message,
        name: name,
      })
    } else {
      const err: any = exception
      const status = err.status || HttpStatus.INTERNAL_SERVER_ERROR
      const name = err.name || err.statusText || 'INTERNAL_SERVER_ERROR'
      let message = err.message || err.data?.message || 'INTERNAL_SERVER_ERROR'
      if (message.message) {
        message = message.message
      }

      response.status(status).json({
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url,
        message: message,
        name: name,
      })
    }
  }
}

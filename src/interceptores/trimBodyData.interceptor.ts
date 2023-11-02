import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'

@Injectable()
export class TrimInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest()
    const { body } = request
    if (body) {
      for (const key in body) {
        if (typeof body[key] === 'string') {
          body[key] = body[key].trim()
        }
      }
    }
    return next.handle().pipe(
      map((data) => {
        return data
      }),
    )
  }
}

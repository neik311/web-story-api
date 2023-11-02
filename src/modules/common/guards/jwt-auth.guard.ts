import { Injectable } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

/** Xác thực admin */
@Injectable()
export class JwtAuthGuard extends AuthGuard('admin') {}

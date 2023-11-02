import { Injectable } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

/** Xác thực user */
@Injectable()
export class UserAuthGuard extends AuthGuard('user') {}

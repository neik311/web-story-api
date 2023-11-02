import {
  ACTION_SUCCESS,
  ERROR_CHECK_PASSWORD,
  ERROR_CHECK_VERIFY_CODE,
  ERROR_CREATE_USER,
  ERROR_INPUT_EMAIL_PASSWORD,
  ERROR_INPUT_EMAIL_USERNAME,
  ERROR_LOCK_ACCOUNT,
  ERROR_NOT_FOUND_DATA,
  ERROR_TIME_VERIFY_CODE,
  ERROR_VERIFY_ACCOUNT,
  UPDATE_ACTIVE_SUCCESS,
} from './../../constants/index'
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { RoleRepository, UserRepository, VerifyRepository } from '../../repositories'
import { CREATE_SUCCESS, ERROR_EMAIL_TAKEN, ERROR_USERNAME_TAKEN, PWD_SALT_ROUNDS, enumData } from '../../constants'
import { CommentEntity, UserEntity } from '../../entities'
import { EmailService } from '../email/email.service'
import { UserForgotPasswordDto, UserVerifyDto, UserLoginDto, UserCreateDto, UserUpdateDto } from './dto'
import { FilterOneDto, PaginationDto, UserDto } from '../../dto'
import { In, Like } from 'typeorm'

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private repo: UserRepository,
    private roleRepo: RoleRepository,
    private verifyRepo: VerifyRepository,
    private emailService: EmailService,
  ) {}

  public async register(data: UserCreateDto) {
    const foundUser = await this.repo.findOne({ where: [{ email: data.email }, { username: data.username }] })
    if (foundUser) {
      if (foundUser.username === data.username) throw new Error(ERROR_USERNAME_TAKEN)
      if (foundUser.email === data.email && foundUser.verified === true) throw new Error(ERROR_EMAIL_TAKEN)
    }

    const foundRole = await this.roleRepo.findOne({ where: { code: enumData.Role.User.code } })
    if (!foundRole)  throw new Error(ERROR_CREATE_USER)

    let newUserEntity = foundUser ? foundUser : new UserEntity()
    newUserEntity.email = data.email
    newUserEntity.password = data.password
    newUserEntity.avatar = data.avatar
    newUserEntity.username = data.username
    newUserEntity.roleId = foundRole.id
    newUserEntity.createdAt = new Date()
    newUserEntity.createdBy = newUserEntity.username
    await this.repo.save(newUserEntity)
    newUserEntity.createdBy = newUserEntity.id
    newUserEntity.password = data.password
    await Promise.all([this.repo.save(newUserEntity), this.emailService.sendEmailVerify({ email: newUserEntity.email })])
    return { message: CREATE_SUCCESS }
  }

  public async login(data: UserLoginDto) {
    if (!data.email && !data.username) throw new Error(ERROR_INPUT_EMAIL_USERNAME)
    if (!data.password) throw new Error(ERROR_INPUT_EMAIL_PASSWORD)
    const foundUser: any = await this.repo.findOne({ where: [{ email: data.email }, { username: data.username }], relations: { role: true } })
    if (!foundUser) throw new Error(ERROR_NOT_FOUND_DATA)
    if (foundUser.isDeleted === true) throw new Error(ERROR_LOCK_ACCOUNT)
    if (foundUser.verified === false) throw new Error(ERROR_VERIFY_ACCOUNT)

    const isPasswordMatch = await foundUser.comparePassword(data.password)
    if (!isPasswordMatch) throw new UnauthorizedException(ERROR_CHECK_PASSWORD)
    foundUser.roleCode = foundUser?.__role__?.code
    foundUser.roleName = foundUser?.__role__?.name
    delete foundUser.password
    delete foundUser.__role__
    return { ...foundUser, accessToken: this.jwtService?.sign({ uid: foundUser.id }) }
  }

  /** Xác thực email */
  public async verified(data: UserVerifyDto) {
    const [foundUser, foundCode] = await Promise.all([
      this.repo.findOne({ where: { email: data.email, verified: false, isDeleted: false } }),
      this.verifyRepo.find({ where: { email: data.email }, order: { timeStart: 'desc' } }),
    ])
    if (!foundUser) throw new Error(ERROR_NOT_FOUND_DATA)
    if (foundCode[0].code !== data.code) throw new Error(ERROR_CHECK_VERIFY_CODE)
    if (foundCode[0].timeExpired.getTime() < new Date().getTime()) {
      await this.verifyRepo.delete({ email: data.email })
      throw new Error(ERROR_TIME_VERIFY_CODE)
    }
    await this.repo.update({ email: data.email }, { verified: true })
    await this.verifyRepo.delete({ email: data.email })
    return { message: ACTION_SUCCESS }
  }

  /** Xác thực quên mật khẩu */
  public async verifiedForgotPassword(data: UserForgotPasswordDto) {
    const [foundUser, foundCode] = await Promise.all([
      this.repo.findOne({ where: { email: data.email, verified: true, isDeleted: false } }),
      this.verifyRepo.find({ where: { email: data.email }, order: { timeStart: 'desc' } }),
    ])
    if (!foundUser) throw new Error(ERROR_NOT_FOUND_DATA)
    if (foundCode[0].code !== data.code) throw new Error(ERROR_CHECK_VERIFY_CODE)
    if (foundCode[0].timeExpired.getTime() < new Date().getTime()) {
      await this.verifyRepo.delete({ email: data.email })
      throw new Error(ERROR_TIME_VERIFY_CODE)
    }
    foundUser.password = data.password
    foundUser.updatedAt = new Date()
    foundUser.updatedBy = foundUser.id
    await Promise.all([this.repo.save(foundUser), this.verifyRepo.delete({ email: data.email })])
    return { message: ACTION_SUCCESS }
  }

  /** Lấy thông tin một người dùng */
  public async getInfoUser(user: UserDto) {
    const foundUser: any = await this.repo.findOne({ where: { id: user.id, isDeleted: false, verified: true }, relations: { role: true } })
    if (!foundUser) return null
    foundUser.roleCode = foundUser.__role__.code
    foundUser.roleName = foundUser.__role__.name
    delete foundUser.password
    delete foundUser.__role__
    return foundUser
  }

  /** Phân trang */
  public async pagination(data: PaginationDto) {
    const whereCon: any = {}
    if (data.where.isDeleted != undefined) whereCon.isDeleted = data.where.isDeleted
    if (data.where.verified != undefined) whereCon.verified = data.where.verified
    if (data.where.username) whereCon.username = Like(`%${data.where.username}%`)
    if (data.where.email) whereCon.email = Like(`%${data.where.email}%`)
    whereCon.role = { code: enumData.Role.User.code }

    const res: any[] = await this.repo.findAndCount({
      where: whereCon,
      skip: data.skip,
      take: data.take,
      relations: { role: true },
      order: { createdAt: 'DESC' },
    })
    return res
  }

  /** Cập nhật trạng thái */
  public async updateActive(user: UserDto, data: FilterOneDto) {
    const foundUser = await this.repo.findOne({ where: { id: data.id } })
    if (!foundUser) throw new Error(ERROR_NOT_FOUND_DATA)
    const newIsDeleted = !foundUser.isDeleted
    await this.repo.manager.transaction(async (trans) => {
      const repo = trans.getRepository(UserEntity)
      const commentRepo = trans.getRepository(CommentEntity)
      await Promise.all([
        repo.update({ id: data.id }, { isDeleted: newIsDeleted, updatedAt: new Date(), updatedBy: user.id }),
        commentRepo.update({ userId: foundUser.id }, { isDeleted: newIsDeleted, updatedAt: new Date(), updatedBy: user.id }),
      ])
      const lstCmt = await commentRepo.find({ where: { userId: foundUser.id } })
      const lstCmtId = lstCmt.map((cmt) => cmt.id)
      if (lstCmtId && lstCmtId.length > 0)
        await commentRepo.update({ parentId: In(lstCmtId) }, { isDeleted: newIsDeleted, updatedAt: new Date(), updatedBy: user.id })
    })
    return { message: UPDATE_ACTIVE_SUCCESS }
  }

  /** Cập nhật */
  public async updateData(user: UserDto, data: UserUpdateDto) {
    const foundUser = await this.repo.findOne({ where: { id: user.id } })
    if (!foundUser) throw new Error(ERROR_NOT_FOUND_DATA)
    await this.repo.update({ id: user.id }, { avatar: data.avatar })
    return { message: UPDATE_ACTIVE_SUCCESS }
  }
}

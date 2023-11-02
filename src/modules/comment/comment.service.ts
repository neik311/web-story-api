import { Like, IsNull } from 'typeorm'
import {
  CREATE_SUCCESS,
  ERROR_NOT_FOUND_COMMENT,
  ERROR_NOT_FOUND_DATA,
  ERROR_NOT_FOUND_STORY,
  ERROR_NOT_FOUND_USER,
  UPDATE_ACTIVE_SUCCESS,
  UPDATE_SUCCESS,
} from './../../constants/index'
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { CommentRepository, UserRepository, StoryRepository } from '../../repositories'
import { CommentEntity } from '../../entities'
import { CommentCreateDto, CommentUpdateDto } from './dto'
import { FilterOneDto, PaginationDto, UserDto } from '../../dto'

@Injectable()
export class CommentService {
  constructor(private readonly repo: CommentRepository, private readonly userRepo: UserRepository, private readonly storyRepo: StoryRepository) {}

  public async createData(user: UserDto, data: CommentCreateDto) {
    const lstTask: any[] = [
      this.userRepo.findOne({ where: { id: user.id, isDeleted: false }, select: { id: true } }),
      this.storyRepo.findOne({ where: { id: data.storyId, isDeleted: false }, select: { id: true } }),
    ]
    if (data.parentId) {
      lstTask.push(this.repo.findOne({ where: { id: data.parentId, isDeleted: false, parentId: IsNull() }, select: { id: true } }))
    }
    const [isTakenUser, isTakenStory, isTakenParent] = await Promise.all(lstTask)
    if (!isTakenUser) throw new Error(ERROR_NOT_FOUND_STORY)
    if (!isTakenStory) throw new Error(ERROR_NOT_FOUND_USER)
    if (data.parentId && !isTakenParent) throw new Error(ERROR_NOT_FOUND_COMMENT)

    const newComment = new CommentEntity()
    newComment.userId = user.id
    newComment.storyId = data.storyId
    newComment.createdBy = user.id
    newComment.content = data.content
    newComment.parentId = data.parentId
    newComment.createdAt = new Date()
    await this.repo.save(newComment)
    return { message: CREATE_SUCCESS }
  }

  public async updateData(user: UserDto, data: CommentUpdateDto) {
    const foundComment = await this.repo.findOne({ where: { id: data.id } })
    if (!foundComment) throw new Error(ERROR_NOT_FOUND_DATA)

    foundComment.content = data.content
    foundComment.updatedBy = user.id
    foundComment.updatedAt = new Date()
    await this.repo.save(foundComment)
    return { message: UPDATE_SUCCESS }
  }

  public async updateActive(user: UserDto, data: FilterOneDto) {
    const foundComment = await this.repo.findOne({ where: { id: data.id } })
    if (!foundComment) throw new Error(ERROR_NOT_FOUND_DATA)
    const newIsDeleted = !foundComment.isDeleted
    await Promise.all([
      this.repo.update({ id: data.id }, { isDeleted: newIsDeleted }),
      this.repo.update({ parentId: data.id }, { isDeleted: newIsDeleted }),
    ])

    return { message: UPDATE_ACTIVE_SUCCESS }
  }

  public async pagination(data: PaginationDto) {
    const whereCon: any = {}
    if (data.where.isDeleted != undefined) whereCon.isDeleted = data.where.isDeleted
    if (data.where.storyId) whereCon.storyId = data.where.storyId
    if (data.where.userId) whereCon.storyId = data.where.userId
    whereCon.parentId = IsNull()

    const [res, lstUser]: [any[], any[]] = await Promise.all([
      this.repo.findAndCount({
        where: whereCon,
        skip: data.skip,
        take: data.take,
        relations: {
          children: true,
        },
        order: { createdAt: 'DESC' },
      }),
      this.userRepo.find({}),
    ])
    const mapUser: Map<string, any> = new Map(lstUser.map((user) => [user.id, user]))
    for (let comment of res[0]) {
      comment.username = mapUser.get(comment.userId).username
      comment.userAvatar = mapUser.get(comment.userId).avatar
      if (comment.__children__ && comment.__children__.length > 0) {
        comment.__children__ = comment.__children__.sort((a: any, b: any) => b.createdAt - a.createdAt)
        for (let child of comment.__children__) {
          child.username = mapUser.get(child.userId).username
          child.userAvatar = mapUser.get(child.userId).avatar
        }
      }
    }
    return res
  }
}

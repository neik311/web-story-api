import { Like } from 'typeorm'
import {
  ACTION_SUCCESS,
  CREATE_SUCCESS,
  ERROR_NAME_TAKEN,
  ERROR_NOT_FOUND_DATA,
  ERROR_NOT_FOUND_STORY,
  UPDATE_ACTIVE_SUCCESS,
  UPDATE_SUCCESS,
} from './../../constants/index'
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { FavoriteRepository, ChapterRepository, StoryRepository } from '../../repositories'
import { FavoriteEntity } from '../../entities'
import { FavoriteCreateDto } from './dto'
import { FilterOneDto, PaginationDto, UserDto } from '../../dto'

@Injectable()
export class FavoriteService {
  constructor(private readonly repo: FavoriteRepository, private readonly storyRepo: StoryRepository) {}

  /** Thêm mới dữ liệu */
  public async createData(user: UserDto, data: FavoriteCreateDto) {
    const foundStory = await this.storyRepo.findOne({
      where: {
        id: data.storyId,
      },
    })
    if (!foundStory) throw new Error(ERROR_NOT_FOUND_STORY)
    const newFavorite = new FavoriteEntity()
    newFavorite.userId = user.id
    newFavorite.storyId = data.storyId
    newFavorite.createdBy = user.id
    newFavorite.createdAt = new Date()
    await this.repo.save(newFavorite)
    return { message: CREATE_SUCCESS }
  }

  /** Xóa yêu thích */
  public async deleteFavorite(user: UserDto, data: FavoriteCreateDto) {
    const isTakenFavorite = await this.repo.findOne({ where: { storyId: data.storyId, userId: user.id }, select: { id: true } })
    if (!isTakenFavorite) throw new Error(ERROR_NOT_FOUND_DATA)
    await this.repo.delete({ storyId: data.storyId, userId: user.id })
    return { message: UPDATE_ACTIVE_SUCCESS }
  }

  /** Phân trang */
  public async getFavoriteByUser(user: UserDto, data: PaginationDto) {
    const whereCon: any = {
      userId: user.id,
      isDeleted: false,
      story: {
        isDeleted: false,
      },
    }
    if (data.where.name) whereCon.name = Like(`%${data.where.name}%`)
    const res: any[] = await this.repo.findAndCount({
      where: whereCon,
      relations: {
        story: true,
      },
      order: { createdAt: 'DESC' },
      skip: data.skip,
      take: data.take,
    })
    for (let item of res[0]) {
      item.storyName = item.__story__.name
      item.storyAvatar = item.__story__.avatar
      item.storyId = item.__story__.id
      delete item.__story__
    }
    return res
  }
}

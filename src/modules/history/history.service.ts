import { Like } from 'typeorm'
import {
  ACTION_SUCCESS,
  CREATE_SUCCESS,
  ERROR_NAME_TAKEN,
  ERROR_NOT_FOUND_DATA,
  ERROR_NOT_FOUND_STORY,
  UPDATE_ACTIVE_SUCCESS,
  UPDATE_SUCCESS,
  enumData,
} from './../../constants/index'
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { HistoryRepository, ChapterRepository, StoryRepository } from '../../repositories'
import { HistoryEntity } from '../../entities'
import { HistoryCreateDto, HistoryUpdateDto } from './dto'
import { FilterOneDto, PaginationDto, UserDto } from '../../dto'

@Injectable()
export class HistoryService {
  constructor(
    private readonly repo: HistoryRepository,
    private readonly chapterRepo: ChapterRepository,
    private readonly storyRepo: StoryRepository,
  ) {}

  /** Thêm mới dữ liệu */
  public async createData(user: UserDto, data: HistoryCreateDto) {
    const foundChapter = await this.chapterRepo.findOne({ where: { id: data.chapterId } })
    if (!foundChapter) throw new Error(ERROR_NOT_FOUND_STORY)
    const foundHistory = await this.repo.findOne({
      where: { userId: user.id, chapter: { storyId: foundChapter.storyId } },
      relations: {
        chapter: true,
      },
    })
    /** Nếu tồn tại thì cập nhật */
    if (foundHistory) {
      // foundHistory.chapterId = data.chapterId
      // foundHistory.updatedAt = new Date()
      // foundHistory.updatedBy = user.id
      await this.repo.update({ id: foundHistory.id }, { chapterId: data.chapterId, updatedAt: new Date(), updatedBy: user.id })
      return { message: CREATE_SUCCESS }
    }
    const newHistory = new HistoryEntity()
    newHistory.userId = user.id
    newHistory.chapterId = data.chapterId
    newHistory.createdBy = user.id
    newHistory.createdAt = new Date()
    await this.repo.save(newHistory)
    return { message: CREATE_SUCCESS }
  }

  /** Xóa lịch sử */
  public async deleteHistory(user: UserDto, data: FilterOneDto) {
    const isTakenHistory = await this.repo.findOne({ where: { id: data.id, userId: user.id }, select: { id: true } })
    if (!isTakenHistory) throw new Error(ERROR_NOT_FOUND_DATA)
    await this.repo.delete({ id: data.id })
    return { message: UPDATE_ACTIVE_SUCCESS }
  }

  /** Phân trang */
  public async getHistoryByUser(user: UserDto, data: PaginationDto) {
    const whereCon: any = {
      userId: user.id,
      isDeleted: false,
      chapter: {
        story: {
          isDeleted: false,
        },
      },
    }
    if (data.where.name) whereCon.name = Like(`%${data.where.name}%`)

    const res: any[] = await this.repo.findAndCount({
      where: whereCon,
      relations: {
        chapter: {
          story: true,
        },
      },
      order: { createdAt: 'DESC' },
      take: data.take,
      skip: data.skip,
    })
    for (let item of res[0]) {
      item.chapterNumber = item.__chapter__.chapterNumber
      item.chapterName = item.__chapter__.name
      item.storyName = item.__chapter__.__story__.name
      item.storyTypeName = enumData.StoryType[item.__chapter__.__story__.type].name
      item.storyAvatar = item.__chapter__.__story__.avatar
      item.storyId = item.__chapter__.__story__.id
      delete item.__chapter__
    }
    return res
  }
}

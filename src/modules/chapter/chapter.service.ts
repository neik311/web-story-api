import {
  CREATE_SUCCESS,
  ERROR_CHAPTER_NUMBER_TAKEN,
  ERROR_IS_DELETED_DATA,
  ERROR_NOT_FOUND_DATA,
  ERROR_NOT_FOUND_STORY,
  UPDATE_ACTIVE_SUCCESS,
  UPDATE_SUCCESS,
} from './../../constants/index'
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { ChapterRepository, UserRepository, StoryRepository } from '../../repositories'
import { ChapterEntity, StoryEntity } from '../../entities'
import { ChapterCreateDto, ChapterUpdateDto } from './dto'
import { FilterOneDto, PaginationDto, UserDto } from '../../dto'

@Injectable()
export class ChapterService {
  constructor(private readonly repo: ChapterRepository, private readonly storyRepo: StoryRepository) {}

  public async createData(user: UserDto, data: ChapterCreateDto) {
    const lstTask: any[] = [
      this.repo.findOne({ where: { chapterNumber: data.chapterNumber, storyId: data.storyId }, select: { id: true } }),
      this.storyRepo.findOne({ where: { id: data.storyId, isDeleted: false }, select: { id: true } }),
    ]

    const [isTakenChapter, isTakenStory] = await Promise.all(lstTask)
    if (isTakenChapter) throw new Error(ERROR_CHAPTER_NUMBER_TAKEN)
    if (!isTakenStory) throw new Error(ERROR_NOT_FOUND_STORY)

    await this.repo.manager.transaction(async (trans) => {
      const repo = trans.getRepository(ChapterEntity)
      const storyRepo = trans.getRepository(StoryEntity)
      const newChapter = new ChapterEntity()
      newChapter.chapterNumber = data.chapterNumber
      newChapter.content = data.content
      newChapter.name = data.name
      newChapter.storyId = data.storyId
      newChapter.createdBy = user.id
      newChapter.createdAt = new Date()
      await Promise.all([repo.save(newChapter), storyRepo.update({ id: isTakenStory.id }, { updatedAt: new Date(), updatedBy: user.id })])
    })
    return { message: CREATE_SUCCESS }
  }

  public async updateData(user: UserDto, data: ChapterUpdateDto) {
    const foundChapter = await this.repo.findOne({ where: { id: data.id } })
    if (!foundChapter) throw new Error(ERROR_NOT_FOUND_DATA)
    if (foundChapter.chapterNumber !== data.chapterNumber) {
      const isTaken = await this.repo.findOne({ where: { storyId: data.storyId, chapterNumber: data.chapterNumber } })
      if (isTaken) throw new Error(ERROR_CHAPTER_NUMBER_TAKEN)
    }
    await this.repo.manager.transaction(async (trans) => {
      const repo = trans.getRepository(ChapterEntity)
      const storyRepo = trans.getRepository(StoryEntity)
      foundChapter.chapterNumber = data.chapterNumber
      foundChapter.content = data.content
      foundChapter.name = data.name
      foundChapter.storyId = data.storyId
      foundChapter.updatedBy = user.id
      foundChapter.updatedAt = new Date()
      await repo.save(foundChapter)
      await storyRepo.update({ id: foundChapter.storyId }, { updatedAt: new Date(), updatedBy: user.id })
    })
    return { message: UPDATE_SUCCESS }
  }

  /** Cập nhật trạng thái chapter */
  public async updateActive(user: UserDto, data: FilterOneDto) {
    const foundChapter: any = await this.repo.findOne({ where: { id: data.id }, relations: { story: true } })
    if (!foundChapter) throw new Error(ERROR_NOT_FOUND_DATA)
    if (foundChapter.__story__.isDeleted === true) throw new Error(ERROR_IS_DELETED_DATA)
    const newIsDeleted = !foundChapter.isDeleted
    await this.repo.update({ id: data.id }, { isDeleted: newIsDeleted })
    return { message: UPDATE_ACTIVE_SUCCESS }
  }

  /** Lấy danh sách chapter theo truyện */
  public async getAllChapterByStory(data: FilterOneDto) {
    const lstChapter: ChapterEntity[] = await this.repo.find({
      where: {
        storyId: data.id,
        isDeleted: false,
      },
      order: { chapterNumber: 'ASC' },
    })
    for (let item of lstChapter) {
      delete item.content
    }
    return lstChapter
  }

  /** Lấy danh sách chapter để in */
  public async getAllChapterOrderPrint(data: FilterOneDto) {
    const lstChapter: ChapterEntity[] = await this.repo.find({
      where: {
        storyId: data.id,
        isDeleted: false,
      },
      order: { chapterNumber: 'ASC' },
    })
    return lstChapter
  }

  /** Lấy một chapter */
  public async getChapterById(data: FilterOneDto) {
    const foundChapter: ChapterEntity = await this.repo.findOne({
      where: {
        id: data.id,
        isDeleted: false,
      },
    })
    if (!foundChapter) throw new Error(ERROR_NOT_FOUND_DATA)
    const [lstChapter, foundStory]: [ChapterEntity[], StoryEntity] = await Promise.all([
      this.repo.find({
        where: {
          storyId: foundChapter.storyId,
          isDeleted: false,
        },
        select: {
          id: true,
          chapterNumber: true,
          name: true,
        },
        order: { chapterNumber: 'ASC' },
      }),
      this.storyRepo.findOne({ where: { id: foundChapter.storyId, isDeleted: false } }),
    ])
    const newChapter: any = { ...foundChapter }
    newChapter.prevId = null
    newChapter.nextId = null
    const length = lstChapter.length
    for (let i = 0; i < length; i++) {
      if (lstChapter[i].id === foundChapter.id) {
        newChapter.prevId = i > 0 ? lstChapter[i - 1].id : null
        newChapter.nextId = i < length - 1 ? lstChapter[i + 1].id : null
        break
      }
    }
    return { ...newChapter, lstChapter, storyName: foundStory.name, storyType: foundStory.type }
  }

  /** Phân trang */
  public async pagination(data: PaginationDto) {
    const whereCon: any = {}
    if (data.where.isDeleted != undefined) whereCon.isDeleted = data.where.isDeleted
    if (data.where.storyId) whereCon.storyId = data.where.storyId

    const res: any[] = await this.repo.findAndCount({
      where: whereCon,
      skip: data.skip,
      take: data.take,
      order: { chapterNumber: 'ASC' },
    })
    return res
  }

  /** tăng view chapter */
  public async plusViewCountChapter(data: FilterOneDto) {
    const foundChapter = await this.repo.findOne({
      where: {
        id: data.id,
        isDeleted: false,
      },
    })
    if (!foundChapter) throw new Error(ERROR_NOT_FOUND_DATA)
    foundChapter.viewCount += 1
    await this.repo.save(foundChapter)
    return {message: UPDATE_SUCCESS}
  }
}

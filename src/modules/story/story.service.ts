import { In, Like } from 'typeorm'
import {
  CREATE_SUCCESS,
  ERROR_NAME_TAKEN,
  ERROR_NOT_FOUND_DATA,
  UPDATE_ACTIVE_SUCCESS,
  UPDATE_SUCCESS,
  enumData,
  ERROR_NOT_FOUND_CATEGORY,
  ERROR_VAL_STORYTYPE,
  ERROR_INPUT_CATEGORY,
  ERROR_IS_DELETED_DATA,
} from './../../constants/index'
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { CategoryRepository, CategoryStoryRepository, StoryRepository, ChapterRepository, HistoryRepository } from '../../repositories'
import { CategoryStoryEntity, StoryEntity } from '../../entities'
import { StoryCreateDto, StoryUpdateDto } from './dto'
import { FilterOneDto, PaginationDto, UserDto } from '../../dto'
import { coreHelper } from '../../helpers'

@Injectable()
export class StoryService {
  constructor(
    private readonly repo: StoryRepository,
    private readonly cateStoryRepo: CategoryStoryRepository,
    private readonly cateRepo: CategoryRepository,
    private readonly chapterRepo: ChapterRepository,
    private readonly historyRepo: HistoryRepository,
  ) {}

  public async createData(user: UserDto, data: StoryCreateDto) {
    data.name = coreHelper.formatName(data.name)
    if (!data.lstCategoryId || data.lstCategoryId.length === 0) throw new Error(ERROR_INPUT_CATEGORY)
    if (data.type !== enumData.StoryType.comic.code && data.type !== enumData.StoryType.word.code) throw new Error(ERROR_VAL_STORYTYPE)
    const [isTaken, lstCategory] = await Promise.all([
      this.repo.findOne({ where: { name: data.name, type: data.type }, select: { id: true } }),
      this.cateRepo.find({ where: { id: In(data.lstCategoryId), isDeleted: false }, select: { id: true } }),
    ])
    if (isTaken) throw new Error(ERROR_NAME_TAKEN)
    if (lstCategory && lstCategory.length !== data.lstCategoryId.length) throw new Error(ERROR_NOT_FOUND_CATEGORY)
    /** transition thêm mới truyện */
    await this.repo.manager.transaction(async (trans) => {
      const repo = trans.getRepository(StoryEntity)
      const cateStoryRepo = trans.getRepository(CategoryStoryEntity)
      let newStory = new StoryEntity()
      newStory.name = data.name
      newStory.author = data.author
      newStory.otherName = data.otherName
      newStory.finished = data.finished
      newStory.content = data.content
      newStory.type = data.type
      newStory.avatar = data.avatar
      newStory.createdAt = new Date()
      newStory.createdBy = user.id
      newStory.updatedAt = new Date()
      newStory.updatedBy = user.id
      newStory = await repo.save(newStory)
      const lstTask = []
      for (let cateId of data.lstCategoryId) {
        const entity = new CategoryStoryEntity()
        entity.categoryId = cateId
        entity.storyId = newStory.id
        entity.createdAt = new Date()
        entity.createdBy = user.id
        lstTask.push(cateStoryRepo.save(entity))
      }
      await Promise.all(lstTask)
    })
    return { message: CREATE_SUCCESS }
  }

  public async updateData(user: UserDto, data: StoryUpdateDto) {
    data.name = coreHelper.formatName(data.name)
    if (!data.lstCategoryId || data.lstCategoryId.length === 0) throw new Error(ERROR_INPUT_CATEGORY)
    if (data.type !== enumData.StoryType.comic.code && data.type !== enumData.StoryType.word.code) throw new Error(ERROR_VAL_STORYTYPE)
    const [foundStory, lstCategory] = await Promise.all([
      this.repo.findOne({ where: { id: data.id } }),
      this.cateRepo.find({ where: { id: In(data.lstCategoryId), isDeleted: false }, select: { id: true } }),
    ])
    if (!foundStory) throw new Error(ERROR_NOT_FOUND_DATA)
    if (foundStory.isDeleted) throw new Error(ERROR_IS_DELETED_DATA)
    if (lstCategory && lstCategory.length !== data.lstCategoryId.length) throw new Error(ERROR_NOT_FOUND_CATEGORY)
    if (foundStory.name !== data.name) {
      const isTaken = await this.repo.findOne({ where: { name: data.name, type: data.type }, select: { name: true } })
      if (isTaken) throw new Error(ERROR_NAME_TAKEN)
    }

    /** transition cập nhật truyện */
    await this.repo.manager.transaction(async (trans) => {
      const repo = trans.getRepository(StoryEntity)
      const cateStoryRepo = trans.getRepository(CategoryStoryEntity)
      await cateStoryRepo.delete({ storyId: data.id })
      foundStory.name = data.name
      foundStory.author = data.author
      foundStory.otherName = data.otherName
      foundStory.finished = data.finished
      foundStory.content = data.content
      foundStory.type = data.type
      foundStory.avatar = data.avatar
      foundStory.updatedAt = new Date()
      foundStory.updatedBy = user.id
      const lstTask: any[] = [repo.save(foundStory)]
      for (let cateId of data.lstCategoryId) {
        const entity = new CategoryStoryEntity()
        entity.categoryId = cateId
        entity.storyId = foundStory.id
        entity.createdAt = new Date()
        entity.createdBy = user.id
        lstTask.push(cateStoryRepo.save(entity))
      }
      await Promise.all(lstTask)
    })
    return { message: UPDATE_SUCCESS }
  }

  /** Cập nhật trạng thái */
  public async updateActive(user: UserDto, data: FilterOneDto) {
    const foundStory = await this.repo.findOne({ where: { id: data.id }, select: { id: true, name: true, isDeleted: true } })

    if (!foundStory) throw new Error(ERROR_NOT_FOUND_DATA)
    const newIsDeleted = !foundStory.isDeleted
    await this.repo.update({ id: data.id }, { isDeleted: newIsDeleted })
    return { message: UPDATE_ACTIVE_SUCCESS }
  }


  public async pagination(data: PaginationDto) {
    const sortBy = data.where.sortBy || 'updatedAt'
    const orderBy = data.where.orderBy || 'DESC'
    const skip = data.skip || 0
    const take = data.take || 1000000
    const rawQuery = this.repo.createQueryBuilder('story')
    if (data.where.isDeleted != undefined) rawQuery.where(`story.isDeleted = ${data.where.isDeleted}`)
    if (data.where.finished) rawQuery.andWhere(`story.finished = ${data.where.finished}`)
    if (data.where.name) rawQuery.andWhere(`story.name LIKE '%${coreHelper.formatName(data.where.name)}%'`)
    if (data.where.type) rawQuery.andWhere(`story.type LIKE '%${data.where.type}%'`)
    if (data.where.lstCateId) rawQuery.andWhere(`category_story.categoryId IN (:...lstCateId)`, { lstCateId: data.where.lstCateId })

    const res: any[] = await rawQuery
      .leftJoinAndSelect('story.categoryStory', 'category_story')
      .leftJoinAndSelect('category_story.category', 'category')
      .leftJoinAndSelect('story.chapters', 'chapter', 'chapter.isDeleted = false')
      .leftJoinAndSelect('story.comments', 'comment', 'comment.isDeleted = false')
      .leftJoinAndSelect('story.favorites', 'favorite', 'favorite.isDeleted = false')
      .getManyAndCount()
    for (let item of res[0]) {
      item.lstCategoryName = item.__categoryStory__?.map((cate: any) => cate.__category__.name)
      item.lstCategoryId = item.__categoryStory__?.map((cate: any) => cate.__category__.id)
      if (item.__chapters__) {
        let totalView = 0
        for (let chapter of item.__chapters__) {
          totalView += chapter.viewCount
        }
        item.totalView = totalView
        item.chapterCount = item.__chapters__.length
      }
      if (item.__comments__) item.commentCount = item.__comments__.length
      if (item.__favorites__) item.favoriteCount = item.__favorites__.length
      item.typeName = enumData.StoryType[item.type].name
      delete item.__comments__
      delete item.__favorites__
      delete item.__chapters__
      delete item.__categoryStory__
    }

    res[0].sort((a, b) => {
      let valueA = a[sortBy]
      let valueB = b[sortBy]
      if (orderBy === 'DESC') {
        valueA = b[sortBy]
        valueB = a[sortBy]
      }
      if (sortBy === 'updatedAt' || sortBy === 'createdAt') return new Date(valueA).getTime() - new Date(valueB).getTime()
      if (sortBy === 'totalView' || sortBy === 'commentCount' || sortBy === 'favoriteCount' || sortBy === 'chapterCount') return valueA - valueB
      if (sortBy === 'name') return valueA.localeCompare(valueB)
      return 0
    })
    res[0] = res[0].slice(skip, skip + take)
    return res
  }

  /** Lấy một truyện */
  public async getStory(data: FilterOneDto) {
    const foundStory: any = await this.repo.findOne({
      where: {
        id: data.id,
        isDeleted: false,
      },
    })
    // console.log(foundStory)
    if (!foundStory) return null
    const relations = await Promise.all([
      foundStory.chapters,
      foundStory.favorites,
      this.cateStoryRepo.find({ where: { storyId: foundStory.id, isDeleted: false }, relations: { category: true } }),
      this.chapterRepo.find({
        where: {
          storyId: data.id,
          isDeleted: false,
        },
        order: { chapterNumber: 'ASC' },
      }),
      foundStory.comments,
    ])
    const lstChapterId = relations[3].map((chapter) => chapter.id)
    const foundHistory = await this.historyRepo.findOne({
      where: {
        chapterId: In(lstChapterId),
        isDeleted: false,
      },
    })
    foundStory.startChapterId = lstChapterId.length > 0 ? lstChapterId[0] : null
    foundStory.nextChapterId = foundHistory ? foundHistory.chapterId : foundStory.startChapterId
    foundStory.__chapters__ = relations[0]
    foundStory.lstUserIdFavorite = relations[1].map((favorite: any) => favorite.userId)
    foundStory.favoriteCount = relations[1].length
    const foundCate: any[] = relations[2]
    foundStory.commentCount = relations[4].filter((cmt) => !cmt.isDeleted).length
    foundStory.lstCategoryName = foundCate.map((cate: any) => cate.__category__.name)
    foundStory.lstCategoryId = foundCate.map((cate: any) => cate.__category__.id)
    let totalView = 0
    for (let chapter of foundStory.__chapters__) {
      totalView += chapter.viewCount
    }
    foundStory.typeName = enumData.StoryType[foundStory.type].name
    foundStory.totalView = totalView
    delete foundStory.__chapters__
    delete foundStory.__favorites__
    return foundStory
  }
}

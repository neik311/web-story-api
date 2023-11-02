import { Like } from 'typeorm'
import {
  ACTION_SUCCESS,
  CREATE_SUCCESS,
  ERROR_DELETE_CATEGORY,
  ERROR_NAME_TAKEN,
  ERROR_NOT_FOUND_DATA,
  UPDATE_ACTIVE_SUCCESS,
  UPDATE_SUCCESS,
} from './../../constants/index'
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { CategoryRepository, CategoryStoryRepository, StoryRepository } from '../../repositories'
import { CategoryEntity } from '../../entities'
import { CategoryCreateDto, CategoryUpdateDto } from './dto'
import { FilterOneDto, PaginationDto, UserDto } from '../../dto'
import { coreHelper } from '../../helpers'

@Injectable()
export class CategoryService {
  constructor(private readonly repo: CategoryRepository, private readonly cateStoryRepo: CategoryStoryRepository) {}

  /** Thêm mới dữ liệu */
  public async createData(user: UserDto, data: CategoryCreateDto) {
    data.name = coreHelper.formatName(data.name)

    const isTaken = await this.repo.findOne({ where: { name: data.name }, select: { id: true } })
    if (isTaken) throw new Error(ERROR_NAME_TAKEN)
    
    const newCategory = new CategoryEntity()
    newCategory.name = data.name
    newCategory.description = data.description
    newCategory.createdBy = user.id
    newCategory.createdAt = new Date()
    await this.repo.save(newCategory)
    return { message: CREATE_SUCCESS }
  }

  /** Cập nhật dữ liệu */
  public async updateData(user: UserDto, data: CategoryUpdateDto) {
    data.name = coreHelper.formatName(data.name)
    const foundCategory = await this.repo.findOne({ where: { id: data.id } })
    if (!foundCategory) throw new Error(ERROR_NOT_FOUND_DATA)
    if (foundCategory.name !== data.name) {
      const isTakenName = await this.repo.findOne({ where: { name: data.name }, select: { id: true, name: true } })
      if (isTakenName) throw new Error(ERROR_NAME_TAKEN)
    }
    foundCategory.name = data.name
    foundCategory.description = data.description
    foundCategory.updatedBy = user.id
    foundCategory.updatedAt = new Date()
    await this.repo.save(foundCategory)
    return { message: UPDATE_SUCCESS }
  }

  /** Cập nhật trạng thái */
  public async updateActive(user: UserDto, data: FilterOneDto) {
    const [foundCategory, foundStory] = await Promise.all([
      this.repo.findOne({ where: { id: data.id } }),
      this.cateStoryRepo.findOne({ where: { categoryId: data.id, isDeleted: false }, select: { id: true } }),
    ])
    if (!foundCategory) throw new Error(ERROR_NOT_FOUND_DATA)
    if (foundStory) throw new Error(ERROR_DELETE_CATEGORY)
    const newIsDeleted = !foundCategory.isDeleted
    await this.repo.update({ id: data.id }, { isDeleted: newIsDeleted })
    return { message: UPDATE_ACTIVE_SUCCESS }
  }

  /** Phân trang */
  public async pagination(data: PaginationDto) {
    const whereCon: any = {}
    if (data.where.isDeleted != undefined) whereCon.isDeleted = data.where.isDeleted
    if (data.where.name) whereCon.name = Like(`%${data.where.name}%`)

    const res: any[] = await this.repo.findAndCount({
      where: whereCon,
      skip: data.skip,
      take: data.take,
      order: { name: 'ASC' },
    })
    return res
  }
}

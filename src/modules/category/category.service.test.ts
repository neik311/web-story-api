import { CategoryService } from './category.service';
import { Test } from '@nestjs/testing'
import { PaginationDto, UserDto } from '../../dto'
import { CategoryRepository,CategoryStoryRepository } from '../../repositories'
import { CREATE_SUCCESS, ERROR_CODE_TAKEN, ERROR_NAME_TAKEN, ERROR_NOT_FOUND_DATA, IMPORT_SUCCESS, UPDATE_ACTIVE_SUCCESS, UPDATE_SUCCESS, enumData } from '../../constants'
import { CategoryEntity, CategoryStoryEntity } from '../../entities'
import { CategoryCreateDto, CategoryUpdateDto } from './dto'

// ! IMPORTANT: file test có đuôi *.test.ts , *.spec.ts mới được --watch
// run : npx jest --testPathPattern=category.service.test.ts

/** fake data category */
let mockData = {
  name: 'Name',
  description: '',
  isDeleted: false,
}

/** fake data StoryCategory */
let mockDataCateStory = {
  storyId: 'storyId',
  categoryId: 'categoryId',
  isDeleted: false,
}

/** User login */
const curUser: UserDto = {
  id:'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
  username:'admin',
  roleCode: enumData.Role.User.code
}

describe('CategoryService - Danh mục', () => {
  let service: CategoryService

  let fakeRepo: Partial<CategoryRepository>

  let fakeCateStoryRepo: Partial<CategoryStoryRepository>


  const entityManagerMock = {
    transaction: jest.fn().mockImplementation(),
  }

  const id = '18b415ba-ca05-4a91-9ee9-8d0542ccd484'

  /** Khởi tạo */
  beforeEach(async () => {
    /** Giả lập kết quả các hàm trả về của repository */
    fakeRepo = {
      findAndCount: (data: any) => {
        return Promise.resolve([
          [{ id: id,  ...mockData }],
          1,
        ] as [Array<any>, number])

      },
        findOne: (data: any) => {
          const findData = [
            {
              ...mockData,
              id: id,
            },
          ].find((item) => item.id == data.where.id || item.name == data.where.name )
          if (!findData) return Promise.resolve(findData as any)
          const newEntity = new CategoryEntity()
          newEntity.id = findData.id
          newEntity.name = findData.name
          newEntity.isDeleted = findData.isDeleted
          return Promise.resolve(newEntity as CategoryEntity)
        },

      find: (data: any) => {
        const findData = [
          {
            id: id,
            ...mockData,
          },
        ].filter((item) => item.id === data.where?.id)
        return Promise.resolve(findData as any)
      },

      save: (data: any) => {
        mockData = { ...data, mockData }
        return Promise.resolve({
          id: id,
          ...mockData,
        } as any)
      },

      update: (where: any, data: any) => {
        mockData = { ...data, mockData }
        return Promise.resolve({
          id: id,
          ...mockData,
        } as any)
      },

      manager: {
        transaction: jest.fn().mockImplementation((cb) =>
          cb({
            getRepository: (data: any) => fakeRepo,
          }),
        ),
      } as any,
    }

    fakeCateStoryRepo = {
      findOne: (data: any) => {
        const findData = [
          {
            ...mockDataCateStory,
            categoryId: id,
          },
        ].find((item) => item.categoryId === data.where.categoryId )
        if (!findData) return Promise.resolve(findData as any)
        const newEntity = new CategoryStoryEntity()
        newEntity.storyId = findData.storyId
        newEntity.categoryId = id
        newEntity.isDeleted = findData.isDeleted
        return Promise.resolve(newEntity as CategoryStoryEntity)
      },
    }

    // * Tạo test module
    const module = await Test.createTestingModule({
      providers: [
        CategoryService,
        {
          provide: CategoryRepository,
          useValue: fakeRepo,
        },
        {
          provide: CategoryStoryRepository,
          useValue: fakeCateStoryRepo,
        },
      ],
    }).compile()

    service = module.get(CategoryService)
  })

  /** Test case: tạo service thành công */
  it('Tạo service', () => {
    expect(service).toBeDefined()
  })

  /** Test case: hàm pagination */
  it('POST: Phân trang', async () => {
    let lstData = await service.pagination({ skip: 0, take: 10, where: {} } as PaginationDto)
    expect(lstData).toBeDefined()
    expect(lstData).toHaveLength(2)
    expect(lstData).toEqual(expect.arrayContaining([1]))

    fakeRepo.findAndCount = (_data: any) => {
      return Promise.resolve([[], 0] as [Array<any>, number])
    }
    lstData = await service.pagination({ skip: 0, take: 10, where: { code: '123' } } as PaginationDto)
    expect(lstData).toBeDefined()
    expect(lstData).toHaveLength(2)
    expect(lstData).toEqual(expect.arrayContaining([0]))
    expect(lstData).toMatchObject([[], 0])
  })


  /** Test case: hàm createData */
  it('POST: Tạo mới danh mục', async () => {
    jest.spyOn(CategoryEntity.prototype, 'save').mockResolvedValue(new CategoryEntity())
    
    expect(
      service.createData(
        curUser,
        {
          name: 'name',
          description: '',
        } as CategoryCreateDto,
      ),
    ).rejects.toThrow(ERROR_NAME_TAKEN)

    const createData = await service.createData(
      curUser,
      {
        code: 'NEW_CODE',
        name: 'NEW NAME',
        description: '',
      } as CategoryCreateDto,
    )
    expect(createData).toBeDefined()
    expect(createData.message).toEqual(CREATE_SUCCESS)

  })

  /** Test case: Hàm updateData */
  it('POST: Cập nhật danh mục', async () => {

    const updateData = await service.updateData(
      curUser,
      {
        name: 'new_name',
        description: '',
        id: id,
      } as CategoryUpdateDto,
    )
    expect(updateData).toBeDefined()
    expect(updateData.message).toEqual(UPDATE_SUCCESS)
    expect(mockData.name).toEqual('New_name')
  })

  /** Test case: hàm updateActive */
  it('POST: Cập nhật trạng thái', async () => {
    fakeCateStoryRepo.findOne = (_data: any) => {
      return Promise.resolve(null)
    }
    const updateData = await service.updateActive(curUser,{id:id})
    expect(updateData).toBeDefined()
    expect(updateData.message).toEqual(UPDATE_ACTIVE_SUCCESS)
  })

})

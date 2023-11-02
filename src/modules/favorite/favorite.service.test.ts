
import { Test } from '@nestjs/testing'
import { PaginationDto, UserDto } from '../../dto'
import { FavoriteRepository,StoryRepository } from '../../repositories'
import { CREATE_SUCCESS, ERROR_CODE_TAKEN, ERROR_NAME_TAKEN, ERROR_NOT_FOUND_DATA, IMPORT_SUCCESS, UPDATE_ACTIVE_SUCCESS, UPDATE_SUCCESS, enumData } from '../../constants'
import { CategoryEntity, FavoriteEntity, StoryEntity } from '../../entities'
import { FavoriteCreateDto } from './dto'
import { FavoriteService } from './favorite.service'

// ! IMPORTANT: file test có đuôi *.test.ts , *.spec.ts mới được --watch
// run : npx jest --testPathPattern=category.service.test.ts

/** fake data category */
let mockData = {
  name: 'Name',
  description: '',
  isDeleted: false,
}

/** User login */
const curUser: UserDto = {
  id:'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
  username:'admin',
  roleCode: enumData.Role.User.code
}

describe('FavoriteService - Yêu thích', () => {
  let service: FavoriteService

  let fakeRepo: Partial<FavoriteRepository>

  let fakeStoryRepo: Partial<StoryRepository>


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
          return Promise.resolve(findData as any)
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
        mockData = { ...data, ...mockData }
        return Promise.resolve({
          id: id,
          ...mockData,
        } as any)
      },

      delete: (data: any) => {     
        return Promise.resolve(1 as any)
      },

      update: (where: any, data: any) => {
        mockData = { ...data, ...mockData }
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

    fakeStoryRepo = {
      findOne: (data: any) => {
        return Promise.resolve(1 as any)
      },
    }

    // * Tạo test module
    const module = await Test.createTestingModule({
      providers: [
        FavoriteService,
        {
          provide: FavoriteRepository,
          useValue: fakeRepo,
        },
        {
          provide: StoryRepository,
          useValue: fakeStoryRepo,
        },
      ],
    }).compile()

    service = module.get(FavoriteService)
  })

  /** Test case: tạo service thành công */
  it('Tạo service', () => {
    expect(service).toBeDefined()
  })

  /** Test case: hàm pagination */
  it('POST: Lấy ds yêu thích', async () => {
    fakeRepo.findAndCount = (_data: any) => {
      return Promise.resolve([[], 0] as [Array<any>, number])
    }
    const lstData = await service.getFavoriteByUser(curUser,{ skip: 0, take: 10, where: {} } as PaginationDto)
    expect(lstData).toBeDefined()
    expect(lstData).toHaveLength(2)
    expect(lstData).toEqual(expect.arrayContaining([0]))
    expect(lstData).toMatchObject([[], 0])
  })


  /** Test case: hàm createData */
  it('POST: Tạo mới yêu thích', async () => {   
    const createData: any = await 
      service.createData(
        curUser,
        {
          storyId:id,
        } as FavoriteCreateDto,
      )

    expect(createData).toBeDefined()
    expect(createData.message).toEqual(CREATE_SUCCESS)

  })

  /** Test case: Hàm updateData */
  it('POST: Xóa yêu thích', async () => {
    fakeRepo.findOne = (_data: any) => {
      return Promise.resolve(1 as any)
    }
    const updateData = await service.deleteFavorite(
      curUser,
      {
        storyId:id,
      } as FavoriteCreateDto,
    )
    expect(updateData).toBeDefined()
    expect(updateData.message).toEqual(UPDATE_ACTIVE_SUCCESS)
  })

})

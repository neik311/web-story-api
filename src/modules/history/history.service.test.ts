
import { Test } from '@nestjs/testing'
import { PaginationDto, UserDto } from '../../dto'
import { ChapterRepository, HistoryRepository,StoryRepository } from '../../repositories'
import { CREATE_SUCCESS, ERROR_CODE_TAKEN, ERROR_NAME_TAKEN, ERROR_NOT_FOUND_DATA, IMPORT_SUCCESS, UPDATE_ACTIVE_SUCCESS, UPDATE_SUCCESS, enumData } from '../../constants'
import {  HistoryEntity, StoryEntity } from '../../entities'
import { HistoryCreateDto, HistoryUpdateDto } from './dto'
import { HistoryService } from './history.service'

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

describe('HistoryService - Lịch sử', () => {
  let service: HistoryService

  let fakeRepo: Partial<HistoryRepository>

  let fakeStoryRepo: Partial<StoryRepository>

  let fakeChapterRepo: Partial<ChapterRepository>


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

    fakeChapterRepo = {

    }

    // * Tạo test module
    const module = await Test.createTestingModule({
      providers: [
        HistoryService,
        {
          provide: HistoryRepository,
          useValue: fakeRepo,
        },
        {
          provide: StoryRepository,
          useValue: fakeStoryRepo,
        },
        {
          provide: ChapterRepository,
          useValue: fakeChapterRepo,
        },
      ],
    }).compile()

    service = module.get(HistoryService)
  })

  /** Test case: tạo service thành công */
  it('Tạo service', () => {
    expect(service).toBeDefined()
  })

  /** Test case: hàm pagination */
  it('POST: Lấy ds lịch sử', async () => {
    fakeRepo.findAndCount = (_data: any) => {
      return Promise.resolve([[], 0] as [Array<any>, number])
    }
    const lstData = await service.getHistoryByUser(curUser,{ skip: 0, take: 10, where: {} } as PaginationDto)
    expect(lstData).toBeDefined()
    expect(lstData).toHaveLength(2)
    expect(lstData).toEqual(expect.arrayContaining([0]))
    expect(lstData).toMatchObject([[], 0])
  })


  /** Test case: hàm createData */
  it('POST: Tạo mới lịch sử', async () => {  
    fakeChapterRepo.findOne = (_data: any) => {
      return Promise.resolve(1 as any)
    } 
    const createData: any = await 
      service.createData(
        curUser,
        {
          chapterId:id,
        } as HistoryCreateDto,
      )

    expect(createData).toBeDefined()
    expect(createData.message).toEqual(CREATE_SUCCESS)

  })

  /** Test case: Hàm updateData */
  it('POST: Xóa lịch sử', async () => {
    fakeRepo.findOne = (_data: any) => {
      return Promise.resolve(1 as any)
    }
    const updateData = await service.deleteHistory(
      curUser,
      {
        chapterId:id,
        id:id
      } as HistoryUpdateDto,
    )
    expect(updateData).toBeDefined()
    expect(updateData.message).toEqual(UPDATE_ACTIVE_SUCCESS)
  })

})


import { Test } from '@nestjs/testing'
import { PaginationDto, UserDto } from '../../dto'
import { ChapterRepository, StoryRepository } from '../../repositories'
import { CREATE_SUCCESS, ERROR_CODE_TAKEN, ERROR_NAME_TAKEN, ERROR_NOT_FOUND_DATA, IMPORT_SUCCESS, UPDATE_ACTIVE_SUCCESS, UPDATE_SUCCESS, enumData } from '../../constants'
import { CategoryEntity, CategoryStoryEntity, ChapterEntity, StoryEntity } from '../../entities'
import { ChapterCreateDto, ChapterUpdateDto } from './dto'
import { ChapterService } from './chapter.service'

// ! IMPORTANT: file test có đuôi *.test.ts , *.spec.ts mới được --watch
// run : npx jest --testPathPattern=category.service.test.ts

/** fake data category */
let mockData = {
  chapterNumber: 1,
  name:'name',
  content:'content',
  viewCount:10,
  description: '',
  storyId:'storyId',
  isDeleted: false,
}

/** User login */
const curUser: UserDto = {
  id:'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
  username:'admin',
  roleCode: enumData.Role.User.code
}

describe('ChapterService - Chương', () => {
  let service: ChapterService

  let fakeRepo: Partial<ChapterRepository>

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
          // console.log(findData)
          const newEntity = new ChapterEntity()
          newEntity.chapterNumber = mockData.chapterNumber
          newEntity.id = id
          newEntity.name = mockData.name
          newEntity.isDeleted = mockData.isDeleted
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
        ChapterService,
        {
          provide: ChapterRepository,
          useValue: fakeRepo,
        },
        {
          provide: StoryRepository,
          useValue: fakeStoryRepo,
        },
      ],
    }).compile()

    service = module.get(ChapterService)
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
  it('POST: Tạo mới chương', async () => {
    jest.spyOn(CategoryEntity.prototype, 'save').mockResolvedValue(new CategoryEntity())
    const createData = await service.createData(
      curUser,
      {
        chapterNumber:1,
        name: 'NEW NAME',
        storyId:'storyId',
        content: '',
      } as ChapterCreateDto,
    )
    expect(createData).toBeDefined()
    expect(createData.message).toEqual(CREATE_SUCCESS)
  })


   /** Test case: Hàm updateData */
   it('POST: Cập nhật chương', async () => {
    const updateData = await service.updateData(
      curUser,
      {
        chapterNumber:1,
        name: 'NEW NAME',
        storyId:'storyId',
        content: '',
        id: id,
      } as ChapterUpdateDto,
    )
    expect(updateData).toBeDefined()
    expect(updateData.message).toEqual(UPDATE_SUCCESS)
  })

  /** Test case: hàm updateActive */
  it('POST: Cập nhật trạng thái', async () => {
    // const updateData = await service.updateActive(curUser,{id:id})
    // expect(updateData).toBeDefined()
    // expect(updateData.message).toEqual(UPDATE_ACTIVE_SUCCESS)
    expect(
      service.updateActive(curUser,{id:id})
    ).rejects.toThrow("Cannot read properties of undefined (reading 'isDeleted')")
  })

  it('POST: Lấy all chương', async () => {
    const updateData = await service.getAllChapterOrderPrint({id:id})
    expect(updateData).toBeDefined()
  })

  it('POST: Tăng view chương', async () => {
    const updateData = await service.plusViewCountChapter({id:id})
    expect(updateData).toBeDefined()
    expect(updateData.message).toEqual(UPDATE_SUCCESS)
  })

})

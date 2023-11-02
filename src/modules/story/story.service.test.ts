
import { Test } from '@nestjs/testing'
import { CREATE_SUCCESS, ERROR_CODE_TAKEN, ERROR_NAME_TAKEN, ERROR_NOT_FOUND_DATA, ERROR_VAL_STORYTYPE, IMPORT_SUCCESS, UPDATE_ACTIVE_SUCCESS, UPDATE_SUCCESS, enumData } from '../../constants'
import { CategoryRepository, CategoryStoryRepository, StoryRepository, ChapterRepository, HistoryRepository } from '../../repositories'
import {  UserDto } from '../../dto'
import { coreHelper } from '../../helpers'
import { StoryService } from './story.service'
// ! IMPORTANT: file test có đuôi *.test.ts , *.spec.ts mới được --watch
// run : npx jest --testPathPattern=category.service.test.ts

/** fake data category */
let mockData = {
  name: 'name',
  otherName: 'otherName',
  author: 'author',
  content: '',
  type: '',
  finished: false,
  avatar: 'avatar',
  lstCategoryId: ['1'],
  isDeleted: false,
}

/** User login */
const curUser: UserDto = {
  id:'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
  username:'admin',
  roleCode: enumData.Role.User.code
}

describe('StoryService - Truyện', () => {
  let service: StoryService

  let fakeRepo: Partial<StoryRepository>

  let fakeCateStoryRepo: Partial<CategoryStoryRepository>

  let fakeCateRepo: Partial<CategoryRepository>

  let fakeChapterRepo: Partial<ChapterRepository>

  let fakeHistoryRepo: Partial<HistoryRepository>


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
          ].find((item) => item.id == data.where.id )
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

    fakeCateStoryRepo = {
      findOne: (data: any) => {
        return Promise.resolve(1 as any)
      },

      delete: (data: any) => {
        return Promise.resolve(1 as any)
      },
      
    }
    fakeChapterRepo = {
      findOne: (data: any) => {
        return Promise.resolve(1 as any)
      },
      
    }
    fakeChapterRepo = {
      findOne: (data: any) => {
        return Promise.resolve(1 as any)
      },
      
    }
    fakeHistoryRepo = {
      findOne: (data: any) => {
        return Promise.resolve(1 as any)
      },
      
    }

    fakeCateRepo = {
      find: (data: any) => {
        return Promise.resolve(['1'] as any)
      },

      findOne: (data: any) => {
        return Promise.resolve(1 as any)
      },
      
    }

    // * Tạo test module
    const module = await Test.createTestingModule({
      providers: [
        StoryService,
        {
          provide: StoryRepository,
          useValue: fakeRepo,
        },
        {
          provide: CategoryStoryRepository,
          useValue: fakeCateStoryRepo,
        },
        {
          provide: CategoryRepository,
          useValue: fakeCateRepo,
        },
        {
          provide: ChapterRepository,
          useValue: fakeChapterRepo,
        },
        {
          provide: HistoryRepository,
          useValue: fakeHistoryRepo,
        },
      ],
    }).compile()

    service = module.get(StoryService)
  })

  /** Test case: tạo service thành công */
  it('Tạo service', () => {
    expect(service).toBeDefined()
  })


  /** Test case: hàm createData */
  it('POST: Tạo mới truyện', async () => {
    coreHelper.formatName = jest.fn().mockResolvedValue(1)
    const createData = await service.createData(
      curUser,
      {
        name: 'name',
        otherName: '',
        author: '',
        content: '',
        type: enumData.StoryType.comic.code,
        finished: false,
        avatar: '',
        lstCategoryId: ['1']
      } ,
    )
    expect(createData).toBeDefined()
    expect(createData.message).toEqual(CREATE_SUCCESS)

    expect(
      service.createData(
        curUser,
        {
          name: 'name',
          otherName: '',
          author: '',
          content: '',
          type: '',
          finished: false,
          avatar: '',
          lstCategoryId: ['1']
        } ,
      )
    ).rejects.toThrow(ERROR_VAL_STORYTYPE)
  })


  

})

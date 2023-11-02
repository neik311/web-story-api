
import { Test } from '@nestjs/testing'
import { PaginationDto, UserDto } from '../../dto'
import { CREATE_SUCCESS, ERROR_CODE_TAKEN, ERROR_NAME_TAKEN, ERROR_NOT_FOUND_DATA, IMPORT_SUCCESS, UPDATE_ACTIVE_SUCCESS, UPDATE_SUCCESS, enumData } from '../../constants'
import { CommentRepository, UserRepository, StoryRepository } from '../../repositories'
import { CommentEntity } from '../../entities'
import { CommentCreateDto, CommentUpdateDto } from './dto'
import { CommentService } from './comment.service'

// ! IMPORTANT: file test có đuôi *.test.ts , *.spec.ts mới được --watch
// run : npx jest --testPathPattern=category.service.test.ts

/** fake data category */
let mockData = {
  chapterId: "chapterId",
  storyId:'storyId',
  content:'content',
  isDeleted: false,
}

/** User login */
const curUser: UserDto = {
  id:'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
  username:'admin',
  roleCode: enumData.Role.User.code
}

describe('CommentService - Bình luận', () => {
  let service: CommentService

  let fakeRepo: Partial<CommentRepository>

  let fakeStoryRepo: Partial<StoryRepository>

  let fakeUserRepo: Partial<UserRepository>


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

    fakeStoryRepo = {
      findOne: (data: any) => {
        return Promise.resolve(1 as any)
      },
      
    }

    fakeUserRepo = {
      find: (data: any) => {
        return Promise.resolve([] as any)
      },

      findOne: (data: any) => {
        return Promise.resolve(1 as any)
      },
      
    }

    // * Tạo test module
    const module = await Test.createTestingModule({
      providers: [
        CommentService,
        {
          provide: CommentRepository,
          useValue: fakeRepo,
        },
        {
          provide: StoryRepository,
          useValue: fakeStoryRepo,
        },
        {
          provide: UserRepository,
          useValue: fakeUserRepo,
        },
      ],
    }).compile()

    service = module.get(CommentService)
  })

  /** Test case: tạo service thành công */
  it('Tạo service', () => {
    expect(service).toBeDefined()
  })

  /** Test case: hàm pagination */
  it('POST: Phân trang', async () => {
    fakeUserRepo.find = (_data: any) => {
      return Promise.resolve([] as any)
    }
    fakeRepo.findAndCount = (_data: any) => {
      return Promise.resolve([[], 0] as [Array<any>, number])
    }
    const lstData = await service.pagination({ skip: 0, take: 10, where: { code: '123' } } as PaginationDto)
    expect(lstData).toBeDefined()
    expect(lstData).toHaveLength(2)
    expect(lstData).toEqual(expect.arrayContaining([0]))
    expect(lstData).toMatchObject([[], 0])
  })

  /** Test case: hàm createData */
  it('POST: Tạo mới bình luận', async () => {
    const createData = await service.createData(
      curUser,
      {
        storyId:"storyId",
        content: 'content',
      } as CommentCreateDto,
    )
    expect(createData).toBeDefined()
    expect(createData.message).toEqual(CREATE_SUCCESS)
  })


   /** Test case: Hàm updateData */
   it('POST: Cập nhật bình luận', async () => {
    const updateData = await service.updateData(
      curUser,
      {
        storyId:"storyId",
        content: 'content',
        parentId:'parentId',
        id: id,
      } as CommentUpdateDto,
    )
    expect(updateData).toBeDefined()
    expect(updateData.message).toEqual(UPDATE_SUCCESS)
  })

  /** Test case: hàm updateActive */
  it('POST: Cập nhật trạng thái', async () => {
    const updateData = await service.updateActive(curUser,{id:id})
    expect(updateData).toBeDefined()
    expect(updateData.message).toEqual(UPDATE_ACTIVE_SUCCESS)
    // expect(
    //   service.updateActive(curUser,{id:id})
    // ).rejects.toThrow("Cannot read properties of undefined (reading 'isDeleted')")
  })


})

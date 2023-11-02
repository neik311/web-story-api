
import { Test } from '@nestjs/testing'
import { PaginationDto, UserDto } from '../../dto'
import { RoleRepository, UserRepository, VerifyRepository } from '../../repositories'
import { CREATE_SUCCESS, ERROR_EMAIL_TAKEN, ERROR_NOT_FOUND_DATA, ERROR_USERNAME_TAKEN, PWD_SALT_ROUNDS, enumData } from '../../constants'
import { CommentEntity, UserEntity } from '../../entities'
import { EmailService } from '../email/email.service'
import { UserForgotPasswordDto, UserVerifyDto, UserLoginDto, UserCreateDto, UserUpdateDto } from './dto'
import { AuthService } from './auth.service'
import { JwtModule, JwtService } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { EmailModule } from '../email/email.module'
import { TypeOrmExModule } from '../../typeorm'

// ! IMPORTANT: file test có đuôi *.test.ts , *.spec.ts mới được --watch
// run : npx jest --testPathPattern=category.service.test.ts

/** fake data category */
let mockData = {
  username:'username',
  email: 'email',
  password: 'password',
  avatar:'avatar',
  isDeleted: false,
  verified:true,
}

/** User login */
const curUser: UserDto = {
  id:'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
  username:'admin',
  roleCode: enumData.Role.User.code
}

describe('AuthService - Auth', () => {
  let service: AuthService

  let emailService:EmailService

  let jwtService: JwtService

  let fakeRepo: Partial<UserRepository>

  let fakeVerifyRepo: Partial<VerifyRepository>

  let fakeRoleRepo: Partial<VerifyRepository>


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
          ].find((item) => item.id == data.where.id || item.username === data.where[1]?.username)
          const newEntity = new UserEntity()
          newEntity.id = id
          newEntity.username = findData?.username
          newEntity.email = findData?.email
          newEntity.password = findData?.password
          newEntity.verified = findData?.verified
          newEntity.isDeleted = findData?.isDeleted
          newEntity.comparePassword = (_data)=> Promise.resolve(1 as any)
          return Promise.resolve(newEntity as UserEntity)
        },

      find: (data: any) => {
        const findData = [
          {
            id: id,
            ...mockData,
          },
        ].filter((item) => item.id === data.where?.id || item.username === data.where?.username)
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

    fakeRoleRepo = {
      findOne: (data: any) => {
        return Promise.resolve(1 as any)
      },
    }

    fakeVerifyRepo = {
      findOne: (data: any) => {
        return Promise.resolve(1 as any)
      },
    }


    // * Tạo test module
    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserRepository,
          useValue: fakeRepo,
        },
        {
          provide: RoleRepository,
          useValue: fakeRoleRepo,
        },
        {
          provide: VerifyRepository,
          useValue: fakeVerifyRepo,
        },
        {
          provide: EmailService,
          useValue: {
            sendEmailVerify:(_data: any)=>{
              return Promise.resolve(1 as any)
            }
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign:(_data: any)=>{
              return Promise.resolve(1 as any)
            }
          },
        },
        {
          provide: JwtService,
          useValue: jwtService,
        },
        
      ],
     
    }).compile()

    service = module.get(AuthService)
    emailService = module.get(EmailService);
    jwtService = module.get(JwtService);
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
  it('POST: Đăng ký', async () => {
    const createData = await service.register(
      {
        username:'new_username',
        email: 'email',
        password: 'password',
        avatar:'avatar'
      } as UserCreateDto,
    )
    expect(createData).toBeDefined()
    expect(createData.message).toEqual(CREATE_SUCCESS)

    expect(
      service.register(
        {
          username:'username',
          email: 'email',
          password: 'password',
          avatar:'avatar'
        } as UserCreateDto,
      )
    ).rejects.toThrow(ERROR_USERNAME_TAKEN)
  })

  
  /** Test case: hàm createData */
  it('POST: Đăng nhập', async () => {
    jest.spyOn(UserEntity.prototype, 'comparePassword').mockResolvedValue(1 as any)
    const createData = await service.login(
      {
        username:'username',
        password: 'password'
      } as UserLoginDto,
    )
    expect(createData).toBeDefined()

  })



})

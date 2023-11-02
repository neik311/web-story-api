import { Column, Entity, BeforeInsert, BeforeUpdate, JoinColumn, ManyToOne, OneToMany } from 'typeorm'
import { compare, hash } from 'bcrypt'
import { BaseEntity } from './base.entity'
import { PWD_SALT_ROUNDS } from '../constants'
import { ApiProperty } from '@nestjs/swagger'
import { FavoriteEntity, HistoryEntity, RoleEntity } from '.'

/** Tài khoản */
@Entity({ name: 'user' })
export class UserEntity extends BaseEntity {
  @ApiProperty({ description: 'Tài khoản' })
  @Column({
    type: 'varchar',
    length: 50,
    nullable: false,
  })
  username: string

  @ApiProperty({ description: 'Email đăng ký tài khoản' })
  @Column({
    type: 'varchar',
    length: 250,
    nullable: false,
  })
  email: string

  @ApiProperty({ description: 'Mật khẩu' })
  @Column({
    name: 'password',
    type: 'text',
    nullable: false,
  })
  password: string

  @ApiProperty({ description: 'avatar' })
  @Column({
    type: 'varchar',
    length: 500,
    nullable: true,
  })
  avatar: string

  @ApiProperty({ description: 'Đã xác minh ?' })
  @Column({
    nullable: false,
    default: false,
  })
  verified: boolean

  @ApiProperty({ description: 'Loại user' })
  @Column({
    type: 'varchar',
    length: 50,
    nullable: false,
  })
  roleId: string
  @ManyToOne(() => RoleEntity, (p) => p.id)
  @JoinColumn({ name: 'roleId', referencedColumnName: 'id' })
  role: Promise<RoleEntity>

  /** Danh sách lịch sử */
  @OneToMany(() => HistoryEntity, (p) => p.user)
  histories: Promise<HistoryEntity[]>

  /** Danh sách yêu thích */
  @OneToMany(() => FavoriteEntity, (p) => p.user)
  favorites: Promise<FavoriteEntity[]>

  /** Hàm tự động hash password khi save entity */
  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.password) {
      const hashedPassword = await hash(this.password, PWD_SALT_ROUNDS)
      this.password = hashedPassword
    }
  }

  /** Hàm so sánh password truyền vào password chưa hash */
  comparePassword(candidate: string) {
    return compare(candidate, this.password)
  }
}

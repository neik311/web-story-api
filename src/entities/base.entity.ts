import { BaseEntity as Base, Column, PrimaryGeneratedColumn } from 'typeorm'

/** Các trường thông tin chung */
export abstract class BaseEntity extends Base {
  /** Id khóa chính */
  @PrimaryGeneratedColumn('uuid')
  id: string

  /** Ngày tạo */
  @Column({ nullable: false })
  createdAt: Date

  /** Người tạo, lưu user.id */
  @Column({
    type: 'varchar',
    length: 36,
    nullable: false,
  })
  createdBy: string

  /** Ngày sửa cuối */
  @Column({ nullable: true })
  updatedAt: Date

  /** Người sửa cuối, lưu user.id */
  @Column({ type: 'varchar', length: 36, nullable: true })
  updatedBy: string

  /** Xóa mềm? */
  @Column({ name: 'isDeleted', default: false })
  isDeleted: boolean
}

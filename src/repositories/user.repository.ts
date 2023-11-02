import { Repository } from 'typeorm'
import { UserEntity } from '../entities'
import { CustomRepository } from '../typeorm'

@CustomRepository(UserEntity)
export class UserRepository extends Repository<UserEntity> {}

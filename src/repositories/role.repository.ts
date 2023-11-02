import { Repository } from 'typeorm'
import { RoleEntity } from '../entities'
import { CustomRepository } from '../typeorm'

@CustomRepository(RoleEntity)
export class RoleRepository extends Repository<RoleEntity> {}

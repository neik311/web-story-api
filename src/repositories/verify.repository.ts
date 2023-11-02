import { Repository } from 'typeorm'
import { VerifyEntity } from '../entities'
import { CustomRepository } from '../typeorm'

@CustomRepository(VerifyEntity)
export class VerifyRepository extends Repository<VerifyEntity> {}

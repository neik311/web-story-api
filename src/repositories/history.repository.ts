import { Repository } from 'typeorm'
import { HistoryEntity } from '../entities'
import { CustomRepository } from '../typeorm'

@CustomRepository(HistoryEntity)
export class HistoryRepository extends Repository<HistoryEntity> {}

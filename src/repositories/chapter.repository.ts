import { Repository } from 'typeorm'
import { ChapterEntity } from '../entities'
import { CustomRepository } from '../typeorm'

@CustomRepository(ChapterEntity)
export class ChapterRepository extends Repository<ChapterEntity> {}

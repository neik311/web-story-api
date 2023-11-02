import { Repository } from 'typeorm'
import { FavoriteEntity } from '../entities'
import { CustomRepository } from '../typeorm'

@CustomRepository(FavoriteEntity)
export class FavoriteRepository extends Repository<FavoriteEntity> {}

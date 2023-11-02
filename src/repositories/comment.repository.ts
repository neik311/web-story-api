import { Repository } from 'typeorm'
import { CommentEntity } from '../entities'
import { CustomRepository } from '../typeorm'

@CustomRepository(CommentEntity)
export class CommentRepository extends Repository<CommentEntity> {}

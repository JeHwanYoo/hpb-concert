import { PrismaService } from '../../prisma/prisma.service'
import { ConcertsRepository } from '../../../domains/concerts/concerts.repository'
import {
  ConcertCreationModel,
  ConcertModel,
} from '../../../domains/concerts/models/concert.model'
import { Injectable } from '@nestjs/common'

@Injectable()
export class ConcertsPrismaRepository implements ConcertsRepository {
  constructor(private readonly prisma: PrismaService) {}

  /**
   *
   * @param creationModel
   * @returns Created Concert
   */
  create(creationModel: ConcertCreationModel): Promise<ConcertModel> {
    return this.prisma.concert.create({
      data: creationModel,
    })
  }

  /**
   *
   * @returns Found Concerts
   */
  findManyBy(): Promise<ConcertModel[]> {
    return this.prisma.concert.findMany()
  }
}

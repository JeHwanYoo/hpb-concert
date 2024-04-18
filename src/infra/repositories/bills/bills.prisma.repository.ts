import { Injectable } from '@nestjs/common'
import { BillsRepository } from '../../../domains/bills/bills.repository'
import {
  BillCreationModel,
  BillModel,
} from '../../../domains/bills/models/bill.model'
import { IdentifierFrom } from '../../../shared/shared.type.helper'
import { PrismaService } from '../../prisma/prisma.service'

@Injectable()
export class BillsPrismaRepository implements BillsRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(creationModel: BillCreationModel): Promise<BillModel> {
    return this.prisma.bill.create({
      data: creationModel,
    })
  }

  findOneBy(identifier: IdentifierFrom<BillModel>): Promise<BillModel | null> {
    return Promise.resolve(undefined)
  }
}

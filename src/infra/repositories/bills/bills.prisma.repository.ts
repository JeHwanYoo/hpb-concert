import { Injectable } from '@nestjs/common'
import { BillsRepository } from '../../../domains/bills/bills.repository'
import {
  BillCreationModel,
  BillModel,
} from '../../../domains/bills/models/bill.model'
import { IdentifierFrom } from '../../../shared/shared.type.helper'
import { PrismaService } from '../../prisma/prisma.service'
import { Prisma } from '@prisma/client'
import { TransactionalOperation } from '../../../shared/transaction/transaction.service'

@Injectable()
export class BillsPrismaRepository implements BillsRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(creationModel: BillCreationModel): TransactionalOperation<BillModel> {
    return () =>
      this.prisma.bill.create({
        data: creationModel,
      })
  }

  findOneBy(
    by: IdentifierFrom<BillModel>,
  ): TransactionalOperation<BillModel | null> {
    return () =>
      this.prisma.bill.findUnique({
        where: by as Prisma.BillWhereUniqueInput,
      })
  }
}

import { Injectable } from '@nestjs/common'
import { BillsRepository } from '../../../domain/bills/bills.repository'
import {
  BillCreationModel,
  BillModel,
} from '../../../domain/bills/model/bill.model'
import { IdentifierFrom } from '../../../shared/shared.type.helper'
import { PrismaService } from '../../prisma.connection/prisma.service'
import { Prisma } from '@prisma/client'
import { TransactionalOperation } from '../../../service/transaction/transaction.service'

@Injectable()
export class BillPrismaRepository implements BillsRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(
    creationModel: BillCreationModel,
  ): TransactionalOperation<BillModel, PrismaService> {
    return connection =>
      (connection ?? this.prisma).bill.create({
        data: creationModel,
      })
  }

  findOneBy(
    by: IdentifierFrom<BillModel>,
  ): TransactionalOperation<BillModel | null, PrismaService> {
    return connection =>
      (connection ?? this.prisma).bill.findUnique({
        where: by as Prisma.BillWhereUniqueInput,
      })
  }
}

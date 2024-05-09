import { Injectable } from '@nestjs/common'
import { IdentifierFrom } from '../../../shared/shared.type.helper'
import { PrismaService } from '../../prisma.connection/prisma.service'
import { Prisma } from '@prisma/client'
import { TransactionalOperation } from '../../../service/transaction/transaction.service'
import { BillRepository } from '../../../domain/bill/bill.repository'
import {
  BillCreationModel,
  BillModel,
} from '../../../domain/bill/model/bill.model'

@Injectable()
export class BillPrismaRepository implements BillRepository {
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

import { ChargeRepository } from '../../../domain/charge/charge.repository'
import { IdentifierFrom } from '../../../shared/shared.type.helper'
import {
  ChargeCreationModel,
  ChargeModel,
  ChargeUpdatingModel,
} from '../../../domain/charge/model/charge.model'
import { PrismaService } from '../../prisma.connection/prisma.service'
import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { TransactionalOperation } from '../../../shared/transaction/transaction.service'

@Injectable()
export class ChargePrismaRepository implements ChargeRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(
    creationModel: ChargeCreationModel,
  ): TransactionalOperation<ChargeModel, PrismaService> {
    return connection =>
      (connection ?? this.prisma).charge.create({
        data: creationModel,
      })
  }

  findOneBy(
    by: IdentifierFrom<ChargeModel>,
  ): TransactionalOperation<ChargeModel, PrismaService> {
    return connection =>
      (connection ?? this.prisma).charge.findUnique({
        where: by as Prisma.ChargeWhereUniqueInput,
      })
  }

  update(
    userId: string,
    updatingModel: ChargeUpdatingModel,
  ): TransactionalOperation<ChargeModel, PrismaService> {
    return async connection => {
      return (connection ?? this.prisma).charge.update({
        where: {
          userId,
        },
        data: updatingModel,
      })
    }
  }
}

import { ChargesRepository } from '../../../domains/charges/charges.repository'
import { IdentifierFrom } from '../../../shared/shared.type.helper'
import {
  ChargeCreationModel,
  ChargeModel,
  ChargeUpdatingModel,
} from '../../../domains/charges/models/charge.model'
import { PrismaService } from '../../prisma/prisma.service'
import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { TransactionalOperation } from '../../../shared/transaction/transaction.service'

@Injectable()
export class ChargesPrismaRepository implements ChargesRepository {
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
    chargeId: string,
    updatingModel: ChargeUpdatingModel,
  ): TransactionalOperation<ChargeModel | null, PrismaService> {
    return async connection => {
      const { userId, ...rest } = updatingModel
      try {
        return await (connection ?? this.prisma).charge.update({
          where: {
            id: chargeId,
            userId: updatingModel.userId,
          },
          data: rest,
        })
      } catch (e) {
        // todo logging
        return null
      }
    }
  }
}

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
  ): TransactionalOperation<ChargeModel> {
    return () =>
      this.prisma.charge.create({
        data: creationModel,
      })
  }

  findOneBy(
    by: IdentifierFrom<ChargeModel>,
  ): TransactionalOperation<ChargeModel> {
    return () =>
      this.prisma.charge.findUnique({
        where: by as Prisma.ChargeWhereUniqueInput,
      })
  }

  update(
    chargeId: string,
    updatingModel: ChargeUpdatingModel,
  ): TransactionalOperation<ChargeModel | null> {
    return async () => {
      const { userId, ...rest } = updatingModel
      try {
        return await this.prisma.charge.update({
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

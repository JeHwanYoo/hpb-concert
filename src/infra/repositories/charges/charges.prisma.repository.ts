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

@Injectable()
export class ChargesPrismaRepository implements ChargesRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(creationModel: ChargeCreationModel): Promise<ChargeModel> {
    return this.prisma.charge.create({
      data: creationModel,
    })
  }

  findOneBy(by: IdentifierFrom<ChargeModel>): Promise<ChargeModel> {
    return this.prisma.charge.findUnique({
      where: by as Prisma.ChargeWhereUniqueInput,
    })
  }

  async update(
    chargeId: string,
    updatingModel: ChargeUpdatingModel,
  ): Promise<ChargeModel | null> {
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

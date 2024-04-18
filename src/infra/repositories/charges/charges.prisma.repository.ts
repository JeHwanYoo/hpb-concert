import { ChargesRepository } from '../../../domains/charges/charges.repository'
import { IdentifierFrom } from '../../../shared/shared.type.helper'
import {
  ChargeCreationModel,
  ChargeModel,
  ChargeUpdatingModel,
} from '../../../domains/charges/models/charge.model'
import { PrismaService } from '../../prisma/prisma.service'

export class ChargesPrismaRepository implements ChargesRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(creationModel: ChargeCreationModel): Promise<ChargeModel> {
    return Promise.resolve(undefined)
  }

  findOneBy(by: IdentifierFrom<ChargeModel>): Promise<ChargeModel> {
    return Promise.resolve(undefined)
  }

  update(
    chargeId: string,
    updatingModel: ChargeUpdatingModel,
  ): Promise<ChargeModel> {
    return Promise.resolve(undefined)
  }
}

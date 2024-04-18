import { Injectable } from '@nestjs/common'
import { BillsRepository } from '../../../domains/bills/bills.repository'
import {
  BillCreationModel,
  BillModel,
} from '../../../domains/bills/models/bill.model'
import { IdentifierFrom } from '../../../shared/shared.type.helper'

@Injectable()
export class BillsPrismaRepository implements BillsRepository {
  create(creationModel: BillCreationModel): Promise<BillModel> {
    return Promise.resolve(undefined)
  }

  findOneBy(identifier: IdentifierFrom<BillModel>): Promise<BillModel | null> {
    return Promise.resolve(undefined)
  }
}

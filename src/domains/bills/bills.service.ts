import { Inject, Injectable } from '@nestjs/common'
import { BillsRepository, BillsRepositoryToken } from './bills.repository'
import { BillCreationModel, BillModel } from './models/bill.model'
import { IdentifierFrom } from '../../shared/shared.type.helper'

@Injectable()
export class BillsService {
  constructor(
    @Inject(BillsRepositoryToken)
    private readonly billsRepository: BillsRepository,
  ) {}

  /**
   *
   * @param createModel
   * @returns created bill
   */
  create(createModel: BillCreationModel): Promise<BillModel> {
    return this.billsRepository.create(createModel)
  }

  /**
   *
   * @param identifier
   * @returns found bill
   */
  findOneBy(identifier: IdentifierFrom<BillModel>): Promise<BillModel> {
    return this.billsRepository.findOneBy(identifier)
  }
}

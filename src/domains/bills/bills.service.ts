import { Inject, Injectable } from '@nestjs/common'
import { BillsRepository, BillsRepositoryToken } from './bills.repository'
import { BillCreationModel, BillModel } from './models/bill.model'

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
   * @param userId
   * @returns found bill
   */
  findByUserId(userId: string): Promise<BillModel> {
    return this.billsRepository.findOneByUserId(userId)
  }
}

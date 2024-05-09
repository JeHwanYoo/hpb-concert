import { Inject, Injectable } from '@nestjs/common'
import { BillRepository, BillsRepositoryToken } from './bill.repository'
import { BillCreationModel, BillModel } from './model/bill.model'
import { IdentifierFrom } from '../../shared/shared.type.helper'
import { NotFoundDomainException } from '../../shared/shared.exception'

@Injectable()
export class BillService {
  constructor(
    @Inject(BillsRepositoryToken)
    private readonly billsRepository: BillRepository,
  ) {}

  /**
   *
   * @param createModel
   * @returns created bill
   */
  create(createModel: BillCreationModel): Promise<BillModel> {
    return this.billsRepository.create(createModel)()
  }

  /**
   *
   * @param identifier
   * @returns found bill
   * @throws NotFoundDomainException
   */
  async findOneBy(identifier: IdentifierFrom<BillModel>): Promise<BillModel> {
    const foundBillModel = await this.billsRepository.findOneBy(identifier)()

    if (!foundBillModel) {
      throw new NotFoundDomainException()
    }

    return foundBillModel
  }
}

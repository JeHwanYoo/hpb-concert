import { Inject, Injectable } from '@nestjs/common'
import { BillRepository, BillRepositoryToken } from './bill.repository'
import { BillCreationModel, BillModel } from './model/bill.model'
import { IdentifierFrom } from '../../shared/shared.type.helper'
import { NotFoundDomainException } from '../../shared/shared.exception'

@Injectable()
export class BillService {
  constructor(
    @Inject(BillRepositoryToken)
    private readonly billsRepository: BillRepository,
  ) {}

  create(createModel: BillCreationModel): Promise<BillModel> {
    return this.billsRepository.create(createModel)()
  }

  async findOneBy(identifier: IdentifierFrom<BillModel>): Promise<BillModel> {
    const foundBillModel = await this.billsRepository.findOneBy(identifier)()

    if (!foundBillModel) {
      throw new NotFoundDomainException()
    }

    return foundBillModel
  }
}

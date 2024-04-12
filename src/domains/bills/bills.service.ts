import { Inject, Injectable } from '@nestjs/common'
import { BillsRepository, BillsRepositoryToken } from './bills.repository'
import { BillCreationModel } from './models/bill.model'

@Injectable()
export class BillsService {
  constructor(
    @Inject(BillsRepositoryToken)
    private readonly billsRepository: BillsRepository,
  ) {}

  create(createModel: BillCreationModel) {
    return this.billsRepository.create(createModel)
  }

  findByUserId(userId: string) {
    return this.billsRepository.findOneByUserId(userId)
  }
}

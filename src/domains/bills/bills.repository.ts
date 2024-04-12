import { BillCreationModel, BillModel } from './models/bill.model'

export const BillsRepositoryToken = 'BillsRepository'

export interface BillsRepository {
  create(creationModel: BillCreationModel): Promise<BillModel>

  findOneByUserId(userId: string): Promise<BillModel>
}

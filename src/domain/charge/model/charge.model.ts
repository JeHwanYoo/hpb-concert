export interface ChargeModel {
  id: string
  userId: string
  amount: number
}

export type ChargeCreationModel = Pick<ChargeModel, 'userId' | 'amount'>

export type ChargeUpdatingModel = Partial<Pick<ChargeModel, 'amount'>>

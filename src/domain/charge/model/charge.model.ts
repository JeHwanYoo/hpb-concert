export interface ChargeCreationModel {
  userId: string
  amount: number
}

export interface ChargeUpdatingModel {
  amount: number
}

export interface ChargeModel {
  /**
   * @description UUID
   */
  id: string
  /**
   * @description user's ID
   */
  userId: string
  /**
   * @description balance
   */
  amount: number
}

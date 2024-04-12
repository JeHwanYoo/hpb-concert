export interface ChargeUpdatingModel {
  /**
   * @description The amount of charging
   */
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
  balance: number
}

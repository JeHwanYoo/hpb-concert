export interface ChargeOrUseModel {
  /**
   * @description The amount of charging
   */
  amount: number
}

export interface ChargeUpdatingModel {
  balance: number
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

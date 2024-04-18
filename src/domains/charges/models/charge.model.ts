export interface ChargeOrUseModel {
  /**
   * @description The amount of charging
   */
  amount: bigint
}

export interface ChargeCreationModel {
  userId: string
  amount: bigint
}

export interface ChargeUpdatingModel {
  amount: bigint
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
  amount: bigint
}

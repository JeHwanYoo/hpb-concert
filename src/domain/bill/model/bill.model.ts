export class BillCreationModel {
  /**
   * @description The seat's id
   */
  seatId: string
  /**
   * @description The holder's id
   */
  holderId: string
  /**
   * @description The paid amount
   */
  amount: number
}

export class BillModel {
  /**
   * @description UUID
   */
  id: string
  /**
   * @description The seat's id
   */
  seatId: string
  /**
   * @description The holder's id
   */
  holderId: string
  /**
   * @description The paid amount
   */
  amount: number
  /**
   * @description CreatedAt
   */
  createdAt: Date
}

export interface OffsetBasedPaginationResult<T> {
  /**
   * @description
   * The total count of items
   */
  total: number
  /**
   * @description
   * The list of items that match the query
   */
  items: T[]
}

export interface OffsetBasedPaginationQuery {
  /**
   * @description
   * The requested page number
   */
  page: number
  /**
   * @description
   * The size of the requested page
   */
  size: number
}

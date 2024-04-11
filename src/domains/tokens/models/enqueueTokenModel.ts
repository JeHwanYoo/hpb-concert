export interface EnqueueTokenModel {
  // requested userId
  userId: string
  // RFC 7519 (seconds)
  availableTime: number
  // RFC 7519 (seconds)
  exp: number
  // Payment completed
  completed: boolean
}

export interface UserTokenModel {
  // UUID
  userId: string
  name: string
}

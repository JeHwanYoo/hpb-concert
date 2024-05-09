export interface EnqueueTokenModel {
  userId: string
  availableTime: number
  exp: number
  completed: boolean
}

export interface UserTokenModel {
  userId: string
  name: string
}

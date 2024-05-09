export interface UserModel {
  id: string
  name: string
  createdAt: Date
  updatedAt: Date
}

export interface UserCreationModel {
  name: string
}

export type UserUpdatingModel = Partial<UserCreationModel>

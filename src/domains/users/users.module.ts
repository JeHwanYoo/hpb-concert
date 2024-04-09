import { DynamicModule, Module, Provider } from '@nestjs/common'
import { UsersService } from './users.service'
import { UsersRepository, UsersRepositoryToken } from './users.repository'

export interface UsersModuleProps {
  UsersRepository: new () => UsersRepository
}

@Module({})
export class UsersModule {
  static forFeature(props: UsersModuleProps): DynamicModule {
    const dynamicUsersRepositoryProvider: Provider = {
      provide: UsersRepositoryToken,
      useClass: props.UsersRepository,
    }

    return {
      module: UsersModule,
      providers: [UsersService, dynamicUsersRepositoryProvider],
      exports: [UsersService],
    }
  }
}

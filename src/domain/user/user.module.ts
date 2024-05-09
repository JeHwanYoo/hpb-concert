import { DynamicModule, Module, Provider } from '@nestjs/common'
import { UserService } from './user.service'
import { UserRepository, UsersRepositoryToken } from './user.repository'
import { PrismaModule } from '../../infra/prisma/prisma.module'

export interface UsersModuleProps {
  UsersRepository: new (...args: unknown[]) => UserRepository
}

@Module({})
export class UserModule {
  static forFeature(props: UsersModuleProps): DynamicModule {
    const dynamicUsersRepositoryProvider: Provider = {
      provide: UsersRepositoryToken,
      useClass: props.UsersRepository,
    }

    return {
      module: UserModule,
      imports: [PrismaModule],
      providers: [UserService, dynamicUsersRepositoryProvider],
      exports: [UserService],
    }
  }
}

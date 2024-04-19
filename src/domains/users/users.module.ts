import { DynamicModule, Module, Provider } from '@nestjs/common'
import { UsersService } from './users.service'
import { UsersRepository, UsersRepositoryToken } from './users.repository'
import { PrismaModule } from '../../infra/prisma/prisma.module'

export interface UsersModuleProps {
  UsersRepository: new (...args: unknown[]) => UsersRepository
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
      imports: [PrismaModule],
      providers: [UsersService, dynamicUsersRepositoryProvider],
      exports: [UsersService],
    }
  }
}

import { DynamicModule, Module, Provider, Type } from '@nestjs/common'
import { ChargeRepository, ChargeRepositoryToken } from './charge.repository'
import { ChargeService } from './charge.service'
import { PrismaModule } from '../../infra/prisma.connection/prisma.module'

export interface ChargesModuleProps {
  ChargeRepository: new (...args: unknown[]) => ChargeRepository
  DBModule: Type
  CacheModule: Type
}

@Module({})
export class ChargeModule {
  static forFeature(props: ChargesModuleProps): DynamicModule {
    const dynamicRepositoryProvider: Provider = {
      provide: ChargeRepositoryToken,
      useClass: props.ChargeRepository,
    }

    return {
      module: ChargeModule,
      imports: [PrismaModule, props.DBModule, props.CacheModule],
      providers: [ChargeService, dynamicRepositoryProvider],
      exports: [ChargeService],
    }
  }
}

import { DynamicModule, Module, Provider } from '@nestjs/common'
import {
  ConcertRepository,
  ConcertsRepositoryToken,
} from './concert.repository'
import { ConcertService } from './concert.service'
import { PrismaModule } from '../../infra/prisma.connection/prisma.module'
import { RedisConnectionModule } from '../../infra/redis/redis.connection.module'

export interface ConcertsModuleProps {
  ConcertRepository: new (...args: unknown[]) => ConcertRepository
  DBModule: PrismaModule
  CacheModule: RedisConnectionModule
}

@Module({})
export class ConcertModule {
  static forFeature(props: ConcertsModuleProps): DynamicModule {
    const dynamicRepositoryProvider: Provider = {
      provide: ConcertsRepositoryToken,
      useClass: props.ConcertRepository,
    }

    return {
      module: ConcertModule,
      imports: [PrismaModule],
      providers: [ConcertService, dynamicRepositoryProvider],
      exports: [ConcertService],
    }
  }
}

import { DynamicModule, Module, Provider } from '@nestjs/common'
import {
  ConcertRepository,
  ConcertsRepositoryToken,
} from './concert.repository'
import { ConcertService } from './concert.service'
import { PrismaModule } from '../../infra/prisma/prisma.module'

export interface ConcertsModuleProps {
  ConcertsRepository: new (...args: unknown[]) => ConcertRepository
}

@Module({})
export class ConcertModule {
  static forFeature(props: ConcertsModuleProps): DynamicModule {
    const dynamicRepositoryProvider: Provider = {
      provide: ConcertsRepositoryToken,
      useClass: props.ConcertsRepository,
    }

    return {
      module: ConcertModule,
      imports: [PrismaModule],
      providers: [ConcertService, dynamicRepositoryProvider],
      exports: [ConcertService],
    }
  }
}

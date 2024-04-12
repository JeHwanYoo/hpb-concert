import { DynamicModule, Module, Provider } from '@nestjs/common'
import {
  ConcertsRepository,
  ConcertsRepositoryToken,
} from './concerts.repository'
import { ConcertsService } from './concerts.service'

export interface ConcertsModuleProps {
  ConcertsRepository: new (...args: unknown[]) => ConcertsRepository
}

@Module({})
export class ConcertsModule {
  static forFeature(props: ConcertsModuleProps): DynamicModule {
    const dynamicUsersRepositoryProvider: Provider = {
      provide: ConcertsRepositoryToken,
      useClass: props.ConcertsRepository,
    }

    return {
      module: ConcertsModule,
      providers: [ConcertsService, dynamicUsersRepositoryProvider],
      exports: [ConcertsService],
    }
  }
}

import { DynamicModule, Module, Provider } from '@nestjs/common'
import { SeatsRepository, SeatsRepositoryToken } from './seats.repository'
import { SeatsService } from './seats.service'

export interface ConcertsModuleProps {
  SeatsRepository: new (...args: unknown[]) => SeatsRepository
}

@Module({})
export class SeatsModule {
  static forFeature(props: ConcertsModuleProps): DynamicModule {
    const dynamicUsersRepositoryProvider: Provider = {
      provide: SeatsRepositoryToken,
      useClass: props.SeatsRepository,
    }

    return {
      module: SeatsModule,
      providers: [SeatsService, dynamicUsersRepositoryProvider],
      exports: [SeatsService],
    }
  }
}

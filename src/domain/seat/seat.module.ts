import { DynamicModule, Module, Provider, Type } from '@nestjs/common'
import { SeatRepository, SeatsRepositoryToken } from './seat.repository'
import { SeatService } from './seat.service'

export interface SeatsModuleProps {
  SeatsRepository: new (...args: unknown[]) => SeatRepository
  DBModule: Type | DynamicModule
  CacheModule: Type | DynamicModule
}

@Module({})
export class SeatModule {
  static forFeature(props: SeatsModuleProps): DynamicModule {
    const dynamicRepositoryProvider: Provider = {
      provide: SeatsRepositoryToken,
      useClass: props.SeatsRepository,
    }

    return {
      module: SeatModule,
      imports: [props.DBModule, props.CacheModule],
      providers: [SeatService, dynamicRepositoryProvider],
      exports: [SeatService],
    }
  }
}

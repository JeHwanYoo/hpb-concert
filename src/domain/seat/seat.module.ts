import { DynamicModule, Module, Type } from '@nestjs/common'
import { SeatService } from './seat.service'

export interface SeatsModuleProps {
  DBModule: Type | DynamicModule
  RepositoryModule: Type | DynamicModule
  CacheModule: Type | DynamicModule
}

@Module({})
export class SeatModule {
  static forFeature(props: SeatsModuleProps): DynamicModule {
    return {
      module: SeatModule,
      imports: [props.DBModule, props.CacheModule, props.RepositoryModule],
      providers: [SeatService],
      exports: [SeatService],
    }
  }
}

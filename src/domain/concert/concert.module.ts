import { DynamicModule, Module, Type } from '@nestjs/common'
import { ConcertService } from './concert.service'

export interface ConcertsModuleProps {
  DBModule: Type | DynamicModule
  RepositoryModule: Type | DynamicModule
  CacheModule: Type | DynamicModule
}

@Module({})
export class ConcertModule {
  static forFeature(props: ConcertsModuleProps): DynamicModule {
    return {
      module: ConcertModule,
      imports: [props.DBModule, props.RepositoryModule, props.CacheModule],
      providers: [ConcertService],
      exports: [ConcertService],
    }
  }
}

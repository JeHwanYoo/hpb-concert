import { DynamicModule, Module, Type } from '@nestjs/common'
import { ChargeService } from './charge.service'

export interface ChargesModuleProps {
  DBModule: Type | DynamicModule
  RepositoryModule: Type | DynamicModule
  CacheModule: Type | DynamicModule
}

@Module({})
export class ChargeModule {
  static forFeature(props: ChargesModuleProps): DynamicModule {
    return {
      module: ChargeModule,
      imports: [props.DBModule, props.CacheModule, props.RepositoryModule],
      providers: [ChargeService],
      exports: [ChargeService],
    }
  }
}

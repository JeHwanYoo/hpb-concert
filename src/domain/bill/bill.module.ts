import { DynamicModule, Module, Type } from '@nestjs/common'
import { BillService } from './bill.service'

export interface BillModuleProps {
  DBModule: Type | DynamicModule
  RepositoryModule: Type | DynamicModule
  CacheModule: Type | DynamicModule
}

@Module({})
export class BillModule {
  static forFeature(props: BillModuleProps): DynamicModule {
    return {
      module: BillModule,
      imports: [props.DBModule, props.CacheModule, props.RepositoryModule],
      providers: [BillService],
      exports: [BillService],
    }
  }
}

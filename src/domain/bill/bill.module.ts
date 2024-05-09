import { DynamicModule, Module, Provider, Type } from '@nestjs/common'
import { BillRepository, BillRepositoryToken } from './bill.repository'
import { BillService } from './bill.service'

export interface BillModuleProps {
  BillRepository: new (...args: unknown[]) => BillRepository
  DBModule: Type | DynamicModule
  CacheModule: Type | DynamicModule
}

@Module({})
export class BillModule {
  static forFeature(props: BillModuleProps): DynamicModule {
    const dynamicRepositoryProvider: Provider = {
      provide: BillRepositoryToken,
      useClass: props.BillRepository,
    }

    return {
      module: BillModule,
      imports: [props.DBModule, props.CacheModule],
      providers: [BillService, dynamicRepositoryProvider],
      exports: [BillService],
    }
  }
}

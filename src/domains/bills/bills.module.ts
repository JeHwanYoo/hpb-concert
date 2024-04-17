import { DynamicModule, Module, Provider } from '@nestjs/common'
import {
  TransactionService,
  TransactionServiceToken,
} from '../../shared/transaction/transaction.service'
import { BillsRepository, BillsRepositoryToken } from './bills.repository'
import { BillsService } from './bills.service'

export interface BillModuleProps {
  SeatsRepository: new (...args: unknown[]) => BillsRepository
  TransactionService: new (...args: unknown[]) => TransactionService
}

@Module({})
export class BillsModule {
  static forFeature(props: BillModuleProps): DynamicModule {
    const dynamicRepositoryProvider: Provider = {
      provide: BillsRepositoryToken,
      useClass: props.SeatsRepository,
    }

    const dynamicTransactionService: Provider = {
      provide: TransactionServiceToken,
      useClass: props.TransactionService,
    }

    return {
      module: BillsModule,
      providers: [
        BillsService,
        dynamicRepositoryProvider,
        dynamicTransactionService,
      ],
      exports: [BillsService],
    }
  }
}

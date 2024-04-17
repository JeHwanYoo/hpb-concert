import { DynamicModule, Module, Provider } from '@nestjs/common'
import {
  TransactionService,
  TransactionServiceToken,
} from './transaction.service'

export interface TransactionModuleProps {
  transactionService: new (...args: unknown[]) => TransactionService
}

@Module({})
export class TransactionModule {
  static forFeature(props: TransactionModuleProps): DynamicModule {
    const dynamicTransactionService: Provider = {
      provide: TransactionServiceToken,
      useClass: props.transactionService,
    }

    return {
      module: TransactionModule,
      providers: [dynamicTransactionService],
      exports: [dynamicTransactionService],
    }
  }
}

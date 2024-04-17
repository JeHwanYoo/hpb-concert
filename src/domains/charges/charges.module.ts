import { DynamicModule, Module, Provider } from '@nestjs/common'
import {
  TransactionService,
  TransactionServiceToken,
} from '../../shared/transaction/transaction.service'
import { ChargesRepository, ChargesRepositoryToken } from './charges.repository'
import { ChargesService } from './charges.service'

export interface ChargesModuleProps {
  SeatsRepository: new (...args: unknown[]) => ChargesRepository
  TransactionService: new (...args: unknown[]) => TransactionService
}

@Module({})
export class ChargesModule {
  static forFeature(props: ChargesModuleProps): DynamicModule {
    const dynamicRepositoryProvider: Provider = {
      provide: ChargesRepositoryToken,
      useClass: props.SeatsRepository,
    }

    const dynamicTransactionService: Provider = {
      provide: TransactionServiceToken,
      useClass: props.TransactionService,
    }

    return {
      module: ChargesModule,
      providers: [
        ChargesService,
        dynamicRepositoryProvider,
        dynamicTransactionService,
      ],
      exports: [ChargesService],
    }
  }
}

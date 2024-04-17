import { DynamicModule, Module, Provider } from '@nestjs/common'
import { SeatsRepository, SeatsRepositoryToken } from './seats.repository'
import { SeatsService } from './seats.service'
import {
  TransactionService,
  TransactionServiceToken,
} from '../../shared/transaction/transaction.service'

export interface ConcertsModuleProps {
  SeatsRepository: new (...args: unknown[]) => SeatsRepository
  TransactionService: new (...args: unknown[]) => TransactionService
}

@Module({})
export class SeatsModule {
  static forFeature(props: ConcertsModuleProps): DynamicModule {
    const dynamicRepositoryProvider: Provider = {
      provide: SeatsRepositoryToken,
      useClass: props.SeatsRepository,
    }

    const dynamicTransactionService: Provider = {
      provide: TransactionServiceToken,
      useClass: props.TransactionService,
    }

    return {
      module: SeatsModule,
      providers: [
        SeatsService,
        dynamicRepositoryProvider,
        dynamicTransactionService,
      ],
      exports: [SeatsService],
    }
  }
}

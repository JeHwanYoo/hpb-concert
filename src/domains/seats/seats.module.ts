import { DynamicModule, Module, Provider } from '@nestjs/common'
import { SeatsRepository, SeatsRepositoryToken } from './seats.repository'
import { SeatsService } from './seats.service'
import {
  TransactionService,
  TransactionServiceToken,
} from '../../shared/transaction/transaction.service'
import { PrismaModule } from '../../infra/prisma/prisma.module'
import { LockService, LockServiceToken } from '../../shared/lock/lock.service'

export interface ConcertsModuleProps {
  SeatsRepository: new (...args: unknown[]) => SeatsRepository
  TransactionService: new (...args: unknown[]) => TransactionService
  LockService: new (...args: unknown[]) => LockService
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

    const dynamicLockService: Provider = {
      provide: LockServiceToken,
      useClass: props.LockService,
    }

    return {
      module: SeatsModule,
      imports: [PrismaModule],
      providers: [
        SeatsService,
        dynamicRepositoryProvider,
        dynamicTransactionService,
        dynamicLockService,
      ],
      exports: [SeatsService],
    }
  }
}

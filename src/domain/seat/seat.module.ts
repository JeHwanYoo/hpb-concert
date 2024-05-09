import { DynamicModule, Module, Provider } from '@nestjs/common'
import { SeatRepository, SeatsRepositoryToken } from './seat.repository'
import { SeatService } from './seat.service'
import {
  TransactionService,
  TransactionServiceToken,
} from '../../shared/transaction/transaction.service'
import { PrismaModule } from '../../infra/prisma/prisma.module'
import { LockService, LockServiceToken } from '../../shared/lock/lock.service'

export interface ConcertsModuleProps {
  SeatsRepository: new (...args: unknown[]) => SeatRepository
  TransactionService: new (...args: unknown[]) => TransactionService
  LockService: new (...args: unknown[]) => LockService
}

@Module({})
export class SeatModule {
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
      module: SeatModule,
      imports: [PrismaModule],
      providers: [
        SeatService,
        dynamicRepositoryProvider,
        dynamicTransactionService,
        dynamicLockService,
      ],
      exports: [SeatService],
    }
  }
}

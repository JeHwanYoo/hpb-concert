import { DynamicModule, Module, Provider } from '@nestjs/common'
import {
  TransactionService,
  TransactionServiceToken,
} from '../../shared/transaction/transaction.service'
import { BillsRepository, BillsRepositoryToken } from './bills.repository'
import { BillsService } from './bills.service'
import { PrismaModule } from '../../infra/prisma/prisma.module'

export interface BillModuleProps {
  BillsRepository: new (...args: unknown[]) => BillsRepository
  TransactionService: new (...args: unknown[]) => TransactionService
}

@Module({})
export class BillsModule {
  static forFeature(props: BillModuleProps): DynamicModule {
    const dynamicRepositoryProvider: Provider = {
      provide: BillsRepositoryToken,
      useClass: props.BillsRepository,
    }

    const dynamicTransactionService: Provider = {
      provide: TransactionServiceToken,
      useClass: props.TransactionService,
    }

    return {
      module: BillsModule,
      imports: [PrismaModule],
      providers: [
        BillsService,
        dynamicRepositoryProvider,
        dynamicTransactionService,
      ],
      exports: [BillsService],
    }
  }
}

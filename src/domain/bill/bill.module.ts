import { DynamicModule, Module, Provider } from '@nestjs/common'
import {
  TransactionService,
  TransactionServiceToken,
} from '../../shared/transaction/transaction.service'
import { BillRepository, BillsRepositoryToken } from './bill.repository'
import { BillService } from './bill.service'
import { PrismaModule } from '../../infra/prisma/prisma.module'

export interface BillModuleProps {
  BillsRepository: new (...args: unknown[]) => BillRepository
  TransactionService: new (...args: unknown[]) => TransactionService
}

@Module({})
export class BillModule {
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
      module: BillModule,
      imports: [PrismaModule],
      providers: [
        BillService,
        dynamicRepositoryProvider,
        dynamicTransactionService,
      ],
      exports: [BillService],
    }
  }
}

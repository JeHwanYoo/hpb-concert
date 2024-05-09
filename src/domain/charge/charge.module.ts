import { DynamicModule, Module, Provider } from '@nestjs/common'
import {
  TransactionService,
  TransactionServiceToken,
} from '../../shared/transaction/transaction.service'
import { ChargeRepository, ChargesRepositoryToken } from './charge.repository'
import { ChargeService } from './charge.service'
import { PrismaModule } from '../../infra/prisma/prisma.module'

export interface ChargesModuleProps {
  ChargesRepository: new (...args: unknown[]) => ChargeRepository
  TransactionService: new (...args: unknown[]) => TransactionService
}

@Module({})
export class ChargeModule {
  static forFeature(props: ChargesModuleProps): DynamicModule {
    const dynamicRepositoryProvider: Provider = {
      provide: ChargesRepositoryToken,
      useClass: props.ChargesRepository,
    }

    const dynamicTransactionService: Provider = {
      provide: TransactionServiceToken,
      useClass: props.TransactionService,
    }

    return {
      module: ChargeModule,
      imports: [PrismaModule],
      providers: [
        ChargeService,
        dynamicRepositoryProvider,
        dynamicTransactionService,
      ],
      exports: [ChargeService],
    }
  }
}

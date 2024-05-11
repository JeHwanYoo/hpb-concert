import { DynamicModule, Module, Provider } from '@nestjs/common'
import { LockService, LockServiceToken } from './lock.service'

export interface LockModuleProps {
  lockService: new (...args: unknown[]) => LockService
}

@Module({})
export class TransactionModule {
  static forFeature(props: LockModuleProps): DynamicModule {
    const dynamicLockService: Provider = {
      provide: LockServiceToken,
      useClass: props.lockService,
    }

    return {
      module: TransactionModule,
      providers: [dynamicLockService],
      exports: [dynamicLockService],
    }
  }
}

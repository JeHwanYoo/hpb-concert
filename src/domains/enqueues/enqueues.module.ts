import { DynamicModule, Module, Provider } from '@nestjs/common'
import { EnqueuesService } from './enqueues.service'

export interface EnqueuesModuleProps {
  /**
   * @description Throughput per minute
   */
  throughputPerMinute: number
}

@Module({})
export class EnqueuesModule {
  static forFeature(props: EnqueuesModuleProps): DynamicModule {
    const dynamicProvider: Provider = {
      provide: EnqueuesService,
      useValue: new EnqueuesService({
        throughputPerMinute: props.throughputPerMinute,
      }),
    }

    return {
      module: EnqueuesModule,
      providers: [dynamicProvider],
      exports: [dynamicProvider],
    }
  }
}

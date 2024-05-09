import { DynamicModule, Module, Type } from '@nestjs/common'
import { TokenService } from './token.service'

export interface SeatsModuleProps {
  CacheModule: Type | DynamicModule
  JWTModule?: Type | DynamicModule
}

@Module({})
export class TokenModule {
  static forFeature(props: SeatsModuleProps): DynamicModule {
    return {
      module: TokenModule,
      imports: [props.CacheModule, props.JWTModule],
      providers: [TokenService],
      exports: [TokenService, props.JWTModule],
    }
  }
}

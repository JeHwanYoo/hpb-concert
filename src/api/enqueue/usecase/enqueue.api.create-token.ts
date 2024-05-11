import { TokenService } from '../../../domain/token/token.service'
import { Injectable } from '@nestjs/common'

@Injectable()
export class EnqueueApiCreateToken {
  constructor(private readonly tokensService: TokenService) {}

  execute(userId: string) {
    return this.tokensService.createToken(userId)
  }
}

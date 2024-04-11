import { Injectable } from '@nestjs/common'
import { TokensService } from '../../domains/tokens/tokens.service'

@Injectable()
export class EnqueuesApiUseCase {
  constructor(private readonly tokensService: TokensService) {}

  createToken(userId: string) {
    return this.tokensService.createToken(userId)
  }
}

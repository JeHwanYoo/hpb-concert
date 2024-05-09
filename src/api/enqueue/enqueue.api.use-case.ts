import { Injectable } from '@nestjs/common'
import { TokenService } from '../../domain/token/token.service'

@Injectable()
export class EnqueueApiUseCase {
  constructor(private readonly tokensService: TokenService) {}

  createToken(userId: string) {
    return this.tokensService.createToken(userId)
  }
}

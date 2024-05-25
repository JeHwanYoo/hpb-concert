import { ChargeService } from '../../../domain/charge/charge.service'
import { ChargeResponseDto } from '../dto/charge.api.dto'
import { Injectable } from '@nestjs/common'

@Injectable()
export class ChargeUsecaseGetCharge {
  constructor(private readonly chargeService: ChargeService) {}

  execute(userId: string): Promise<ChargeResponseDto> {
    return this.chargeService.findOneBy({
      userId,
    })
  }
}

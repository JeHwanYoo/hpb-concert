import { Injectable } from '@nestjs/common'
import { ChargesResponseDto } from './dto/charges.api.dto'
import { ChargesService } from '../../domains/charges/charges.service'
import { ChargeUpdatingModel } from '../../domains/charges/models/charge.model'

@Injectable()
export class ChargesApiUseCase {
  constructor(private readonly chargeService: ChargesService) {}

  getChargeByUserId(userId: string): Promise<ChargesResponseDto> {
    return this.chargeService.findOneBy({
      userId,
    })
  }

  charge(
    userId: string,
    chargeModel: ChargeUpdatingModel,
  ): Promise<ChargesResponseDto> {
    return this.chargeService.charge(userId, chargeModel)
  }

  use(
    userId: string,
    chargeModel: ChargeUpdatingModel,
  ): Promise<ChargesResponseDto> {
    return this.chargeService.use(userId, chargeModel)
  }
}

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
    id: string,
    chargeModel: ChargeUpdatingModel,
  ): Promise<ChargesResponseDto> {
    return this.chargeService.charge(id, chargeModel)
  }

  use(
    id: string,
    chargeModel: ChargeUpdatingModel,
  ): Promise<ChargesResponseDto> {
    return this.chargeService.use(id, chargeModel)
  }
}

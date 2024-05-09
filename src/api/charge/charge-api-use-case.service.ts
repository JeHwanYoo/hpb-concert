import { Injectable } from '@nestjs/common'
import { ChargeResponseDto } from './dto/charge.api.dto'
import { ChargeService } from '../../domain/charge/charge.service'
import { ChargeUpdatingModel } from '../../domain/charge/model/charge.model'

@Injectable()
export class ChargeApiUseCase {
  constructor(private readonly chargeService: ChargeService) {}

  getChargeByUserId(userId: string): Promise<ChargeResponseDto> {
    return this.chargeService.findOneBy({
      userId,
    })
  }

  charge(
    userId: string,
    chargeModel: ChargeUpdatingModel,
  ): Promise<ChargeResponseDto> {
    return this.chargeService.charge(userId, chargeModel)
  }

  use(
    userId: string,
    chargeModel: ChargeUpdatingModel,
  ): Promise<ChargeResponseDto> {
    return this.chargeService.use(userId, chargeModel)
  }
}

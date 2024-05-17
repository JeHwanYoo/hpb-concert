import { ChargeService } from '../../../domain/charge/charge.service'
import { ChargeResponseDto } from '../dto/charge.api.dto'
import { ChargeUpdatingModel } from '../../../domain/charge/model/charge.model'

export class ChargeUsecaseUse {
  constructor(private readonly chargeService: ChargeService) {}

  execute(
    userId: string,
    chargeModel: ChargeUpdatingModel,
  ): Promise<ChargeResponseDto> {
    return this.chargeService.use(userId, chargeModel)
  }
}

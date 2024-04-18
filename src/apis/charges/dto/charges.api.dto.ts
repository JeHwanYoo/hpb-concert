import { ApiProperty } from '@nestjs/swagger'
import {
  ChargeModel,
  ChargeUpdatingModel,
} from '../../../domains/charges/models/charge.model'

export class ChargesPatchRequestDto
  implements Omit<ChargeUpdatingModel, 'userId'>
{
  @ApiProperty({
    type: Number,
    description: '충전 금액',
    minimum: 0,
  })
  amount: bigint
}

export class ChargesResponseDto implements ChargeModel {
  @ApiProperty({
    type: String,
    description: 'UUID',
    format: 'uuid',
  })
  id: string

  @ApiProperty({
    type: String,
    description: '유저 UUID',
    format: 'uuid',
  })
  userId: string

  @ApiProperty({
    type: Number,
    description: '유저 잔액',
    minimum: 0,
  })
  amount: bigint
}

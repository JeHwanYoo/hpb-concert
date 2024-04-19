import { Body, Controller, Get, Param, Patch } from '@nestjs/common'
import {
  ApiBody,
  ApiHeader,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger'
import {
  ChargesPatchRequestDto,
  ChargesResponseDto,
} from './dto/charges.api.dto'
import { UserTokenExampleValue } from '../../shared/shared.openapi'
import { ChargesApiUseCase } from './charges.api.usecase'

@Controller('v1/charges')
@ApiTags('Charges')
export class ChargesApiController {
  constructor(private readonly chargesApiUseCase: ChargesApiUseCase) {}

  @Get(':user_id')
  @ApiOperation({
    description: '잔액 확인 API',
  })
  @ApiHeader({
    name: 'Authorization',
    description: 'User Bearer token (JWT)',
    required: true,
    schema: {
      type: 'string',
      example: `Bearer ${UserTokenExampleValue}`,
    },
  })
  @ApiOkResponse({
    type: ChargesResponseDto,
  })
  @ApiUnauthorizedResponse()
  getChargeByUserId(
    @Param('user_id') userId: string,
  ): Promise<ChargesResponseDto> {
    return this.chargesApiUseCase.getChargeByUserId(userId)
  }

  @Patch(':charge_id')
  @ApiOperation({
    description: '잔액 충전 / 사용 API',
  })
  @ApiHeader({
    name: 'Authorization',
    description: 'User Bearer token (JWT)',
    required: true,
    schema: {
      type: 'string',
      example: `Bearer ${UserTokenExampleValue}`,
    },
  })
  @ApiBody({
    type: ChargesPatchRequestDto,
  })
  @ApiOkResponse({
    type: ChargesResponseDto,
  })
  @ApiUnauthorizedResponse()
  patchCharge(
    @Param('charge_id') id: string,
    @Body() body: ChargesPatchRequestDto,
  ): Promise<ChargesResponseDto> {
    return body.action === 'charge'
      ? this.chargesApiUseCase.charge(id, {
          userId: '',
          amount: body.amount,
        })
      : this.chargesApiUseCase.use(id, {
          userId: '',
          amount: body.amount,
        })
  }
}

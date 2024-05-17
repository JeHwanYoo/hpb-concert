import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common'
import {
  ApiBody,
  ApiHeader,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger'
import { ChargePatchRequestDto, ChargeResponseDto } from './dto/charge.api.dto'
import { UserTokenExampleValue } from '../../shared/shared.openapi'
import { UserTokenGuard } from '../../domain/token/token.guard'
import { DecodedToken } from '../../domain/token/token.decorator'
import { UserTokenModel } from '../../domain/token/model/token.model'
import { ChargeUsecaseGetCharge } from './usecase/charge.usecase.get-charge'
import { ChargeUsecaseCharge } from './usecase/charge.usecase.charge'
import { ChargeUsecaseUse } from './usecase/charge.usecase.use'

@Controller({
  path: 'charges',
  version: '1',
})
@ApiTags('Charges')
export class ChargeApiController {
  constructor(
    private readonly chargeUsecaseGetCharge: ChargeUsecaseGetCharge,
    private readonly chargeUsecaseCharge: ChargeUsecaseCharge,
    private readonly chargeUsecaseUse: ChargeUsecaseUse,
  ) {}

  @Get()
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
    type: ChargeResponseDto,
  })
  @ApiUnauthorizedResponse()
  @UseGuards(UserTokenGuard)
  getChargeByUserId(
    @DecodedToken<UserTokenModel>() decodedUserToken: UserTokenModel,
  ): Promise<ChargeResponseDto> {
    return this.chargeUsecaseGetCharge.execute(decodedUserToken.userId)
  }

  @Patch()
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
    type: ChargePatchRequestDto,
  })
  @ApiOkResponse({
    type: ChargeResponseDto,
  })
  @ApiUnauthorizedResponse()
  @UseGuards(UserTokenGuard)
  patchCharge(
    @DecodedToken<UserTokenModel>() decodedUserToken: UserTokenModel,
    @Body() body: ChargePatchRequestDto,
  ): Promise<ChargeResponseDto> {
    return body.action === 'charge'
      ? this.chargeUsecaseCharge.execute(decodedUserToken.userId, {
          amount: body.amount,
        })
      : this.chargeUsecaseUse.execute(decodedUserToken.userId, {
          amount: body.amount,
        })
  }
}

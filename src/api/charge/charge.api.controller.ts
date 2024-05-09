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
import { ChargeApiUseCase } from './charge-api-use-case'
import { UserTokenGuard } from '../../domain/token/token.guard'
import { DecodedToken } from '../../domain/token/token.decorator'
import { UserTokenModel } from '../../domain/token/model/token.model'

@Controller('v1/charge')
@ApiTags('Charges')
export class ChargeApiController {
  constructor(private readonly chargesApiUseCase: ChargeApiUseCase) {}

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
    return this.chargesApiUseCase.getChargeByUserId(decodedUserToken.userId)
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
      ? this.chargesApiUseCase.charge(decodedUserToken.userId, {
          amount: body.amount,
        })
      : this.chargesApiUseCase.use(decodedUserToken.userId, {
          amount: body.amount,
        })
  }
}

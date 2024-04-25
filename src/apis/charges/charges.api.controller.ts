import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common'
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
import { UserTokensGuard } from '../../domains/tokens/tokens.guard'
import { DecodedToken } from '../../domains/tokens/tokens.decorator'
import { UserTokenModel } from '../../domains/tokens/models/enqueueTokenModel'

@Controller('v1/charges')
@ApiTags('Charges')
export class ChargesApiController {
  constructor(private readonly chargesApiUseCase: ChargesApiUseCase) {}

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
    type: ChargesResponseDto,
  })
  @ApiUnauthorizedResponse()
  @UseGuards(UserTokensGuard)
  getChargeByUserId(
    @DecodedToken<UserTokenModel>() decodedUserToken: UserTokenModel,
  ): Promise<ChargesResponseDto> {
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
    type: ChargesPatchRequestDto,
  })
  @ApiOkResponse({
    type: ChargesResponseDto,
  })
  @ApiUnauthorizedResponse()
  @UseGuards(UserTokensGuard)
  patchCharge(
    @DecodedToken<UserTokenModel>() decodedUserToken: UserTokenModel,
    @Body() body: ChargesPatchRequestDto,
  ): Promise<ChargesResponseDto> {
    return body.action === 'charge'
      ? this.chargesApiUseCase.charge(decodedUserToken.userId, {
          amount: body.amount,
        })
      : this.chargesApiUseCase.use(decodedUserToken.userId, {
          amount: body.amount,
        })
  }
}

import { Controller, Get, Param, Patch } from '@nestjs/common'
import { ChargeModel } from '../../domains/charges/models/charge.model'
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
import { UserTokenExampleValue } from '../../shared/share.openapi'

@Controller('v1/charges')
@ApiTags('Charges')
export class ChargesApiController {
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
  getCharge(@Param('user_id') userId: string): Promise<ChargeModel> {
    return
  }

  @Patch(':user_id')
  @ApiOperation({
    description: '잔액 충전 API',
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
  patchCharge(@Param('user_id') userId: string): Promise<ChargeModel> {
    return
  }
}

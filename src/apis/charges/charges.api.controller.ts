import { Controller, Get, Param, Patch } from '@nestjs/common'
import { ChargeModel } from '../../domains/charges/models/charge.model'
import { ApiBody, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger'
import { ChargesRequestDto, ChargesResponseDto } from './dto/charges.api.dto'

@Controller('v1/charges')
@ApiTags('charges')
export class ChargesApiController {
  @Get(':user_id')
  @ApiOperation({
    description: '잔액 확인 API',
  })
  @ApiOkResponse({
    type: ChargesResponseDto,
  })
  getCharge(@Param() userId: string): Promise<ChargeModel> {
    return
  }

  @Patch(':user_id')
  @ApiOperation({
    description: '잔액 충전 API',
  })
  @ApiBody({
    type: ChargesRequestDto,
  })
  @ApiOkResponse({
    type: ChargesResponseDto,
  })
  patchCharge(@Param() userId: string): Promise<ChargeModel> {
    return
  }
}

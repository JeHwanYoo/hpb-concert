import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common'
import {
  ApiBody,
  ApiHeader,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger'
import {
  BillsResponseDto,
  ConcertsPostRequestDto,
  ConcertsResponseDto,
  SeatsResponseDto,
} from './dto/concerts.api.dto'
import {
  EnqueueTokenExampleValue,
  UserTokenExampleValue,
} from '../../shared/shared.openapi'
import {
  EnqueueTokensGuard,
  UserTokensGuard,
} from '../../domains/tokens/tokens.guard'
import { ConcertsApiUseCase } from './concerts.api.usecase'
import { DecodedToken } from '../../domains/tokens/tokens.decorator'
import { EnqueueTokenModel } from '../../domains/tokens/models/enqueueTokenModel'

@Controller('v1/concerts')
@ApiTags('Concerts')
export class ConcertsApiController {
  constructor(private readonly concertApiUseCase: ConcertsApiUseCase) {}

  @Get()
  @ApiOperation({
    description: '콘서트 목록 출력',
  })
  @ApiHeader({
    name: 'Authorization',
    description: 'Enqueue Bearer token (JWT)',
    required: true,
    schema: {
      type: 'string',
      example: `Bearer ${EnqueueTokenExampleValue}`,
    },
  })
  @ApiOkResponse({
    type: ConcertsResponseDto,
    isArray: true,
  })
  @ApiUnauthorizedResponse()
  getConcerts(): Promise<ConcertsResponseDto[]> {
    return this.concertApiUseCase.getConcerts()
  }

  @Get(':concert_id/seats')
  @ApiOperation({
    description: '좌석 목록 출력',
  })
  @ApiHeader({
    name: 'Authorization',
    description: 'Enqueue Bearer token (JWT)',
    schema: {
      type: 'string',
      example: `Bearer ${EnqueueTokenExampleValue}`,
    },
  })
  @ApiOkResponse({
    type: SeatsResponseDto,
    isArray: true,
  })
  @ApiUnauthorizedResponse()
  getSeats(
    @Param('concert_id') concertId: string,
  ): Promise<SeatsResponseDto[]> {
    return
  }

  /**
   * @description
   * 콘서트 생성은 운영자만 가능하겠지만,
   * Role 자체를 구현하지 않을 것이기 때문에, 유저라면 bypass
   */
  @Post()
  @ApiOkResponse({
    description: '콘서트 생성',
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
    type: ConcertsPostRequestDto,
  })
  @ApiOkResponse({
    type: ConcertsResponseDto,
  })
  @UseGuards(UserTokensGuard)
  async createConcert(
    @Body() body: ConcertsPostRequestDto,
  ): Promise<ConcertsResponseDto> {
    try {
      return await this.concertApiUseCase.createConcert(body)
    } catch (e) {
      console.error(e)
    }
  }

  @Post(':concert_id/seats/:seat_no/reservations')
  @ApiOperation({
    description: '좌석 예약',
  })
  @ApiHeader({
    name: 'Authorization',
    description: 'Enqueue Bearer token (JWT)',
    required: true,
    schema: {
      type: 'string',
      example: `Bearer ${EnqueueTokenExampleValue}`,
    },
  })
  @ApiOkResponse({
    type: SeatsResponseDto,
  })
  @ApiUnauthorizedResponse()
  @UseGuards(EnqueueTokensGuard)
  async createReservation(
    @Param('concert_id') concertId: string,
    @Param('seat_no', ParseIntPipe) seatNo: number,
    @DecodedToken<EnqueueTokenModel>() decodedEnqueueToken: EnqueueTokenModel,
  ): Promise<SeatsResponseDto> {
    return this.concertApiUseCase.reserveSeat(
      decodedEnqueueToken.userId,
      concertId,
      seatNo,
    )
  }

  @Post(':concert_id/seats/:seat_id/payments')
  @ApiOperation({
    description: '결제',
  })
  @ApiHeader({
    name: 'Authorization',
    description: 'Enqueue Bearer token (JWT)',
    required: true,
    schema: {
      type: 'string',
      example: `Bearer ${EnqueueTokenExampleValue}`,
    },
  })
  @ApiOkResponse({
    type: BillsResponseDto,
  })
  @ApiUnauthorizedResponse()
  @UseGuards(EnqueueTokensGuard)
  createPayment(
    @Param('concert_id') concertId: string,
    @Param('seat_id') seatId: string,
    @DecodedToken<EnqueueTokenModel>() decodedEnqueueToken: EnqueueTokenModel,
  ): Promise<BillsResponseDto> {
    return this.concertApiUseCase.paySeat(
      decodedEnqueueToken.userId,
      concertId,
      seatId,
    )
  }
}

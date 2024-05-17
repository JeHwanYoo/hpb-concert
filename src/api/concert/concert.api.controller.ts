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
  BillResponseDto,
  ConcertPostRequestDto,
  ConcertResponseDto,
  SeatResponseDto,
} from './dto/concert.api.dto'
import {
  EnqueueTokenExampleValue,
  UserTokenExampleValue,
} from '../../shared/shared.openapi'
import {
  EnqueueTokenGuard,
  UserTokenGuard,
} from '../../domain/token/token.guard'
import { ConcertApiUseCase } from './concert.api.use-case'
import { DecodedToken } from '../../domain/token/token.decorator'
import { EnqueueTokenModel } from '../../domain/token/model/token.model'

@Controller({
  path: 'concerts',
  version: '1',
})
@ApiTags('Concerts')
export class ConcertApiController {
  constructor(private readonly concertApiUseCase: ConcertApiUseCase) {}

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
    type: ConcertResponseDto,
    isArray: true,
  })
  @ApiUnauthorizedResponse()
  getConcerts(): Promise<ConcertResponseDto[]> {
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
    type: SeatResponseDto,
    isArray: true,
  })
  @ApiUnauthorizedResponse()
  getSeats(@Param('concert_id') concertId: string): Promise<SeatResponseDto[]> {
    return this.concertApiUseCase.getSeatsByConcertId(concertId)
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
    type: ConcertPostRequestDto,
  })
  @ApiOkResponse({
    type: ConcertResponseDto,
  })
  @UseGuards(UserTokenGuard)
  async createConcert(
    @Body() body: ConcertPostRequestDto,
  ): Promise<ConcertResponseDto> {
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
    type: SeatResponseDto,
  })
  @ApiUnauthorizedResponse()
  @UseGuards(EnqueueTokenGuard)
  async createReservation(
    @Param('concert_id') concertId: string,
    @Param('seat_no', ParseIntPipe) seatNo: number,
    @DecodedToken<EnqueueTokenModel>() decodedEnqueueToken: EnqueueTokenModel,
  ): Promise<SeatResponseDto> {
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
    type: BillResponseDto,
  })
  @ApiUnauthorizedResponse()
  @UseGuards(EnqueueTokenGuard)
  createPayment(
    @Param('concert_id') concertId: string,
    @Param('seat_id') seatId: string,
    @DecodedToken<EnqueueTokenModel>() decodedEnqueueToken: EnqueueTokenModel,
  ): Promise<BillResponseDto> {
    return this.concertApiUseCase.paySeat(
      decodedEnqueueToken.userId,
      concertId,
      seatId,
    )
  }
}

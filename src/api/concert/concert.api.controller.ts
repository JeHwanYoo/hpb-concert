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
import { DecodedToken } from '../../domain/token/token.decorator'
import { EnqueueTokenModel } from '../../domain/token/model/token.model'
import { ConcertUsecaseCreateConcert } from './usecase/concert.usecase.create-concert'
import { ConcertUsecasePaySeat } from './usecase/concert.usecase.pay-seat'
import { ConcertUsecaseGetConcerts } from './usecase/concert.usecase.get-concerts'
import { ConcertUsecaseReserveSeat } from './usecase/concert.usecase.reserve-seat'
import { ConcertUsecaseGetSeats } from './usecase/concert.usecase.get-seats'

@Controller({
  path: 'concerts',
  version: '1',
})
@ApiTags('Concerts')
export class ConcertApiController {
  constructor(
    private readonly concertUsecaseCreateConcert: ConcertUsecaseCreateConcert,
    private readonly concertUsecaseGetConcerts: ConcertUsecaseGetConcerts,
    private readonly concertUsecaseReserveSeat: ConcertUsecaseReserveSeat,
    private readonly concertUsecasePaySeat: ConcertUsecasePaySeat,
    private readonly concertUsecaseGetSeats: ConcertUsecaseGetSeats,
  ) {}

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
    return this.concertUsecaseGetConcerts.execute()
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
    return this.concertUsecaseGetSeats.execute(concertId)
  }

  @Post()
  @ApiOperation({
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
    return this.concertUsecaseCreateConcert.execute(body)
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
    return this.concertUsecaseReserveSeat.execute(
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
    return this.concertUsecasePaySeat.execute(
      decodedEnqueueToken.userId,
      concertId,
      seatId,
    )
  }
}

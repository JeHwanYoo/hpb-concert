import { Controller, Get, Param, Post } from '@nestjs/common'
import {
  ApiHeader,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger'
import {
  BillsResponseDto,
  ConcertsResponseDto,
  SeatsResponseDto,
} from './dto/concerts.api.dto'
import {
  EnqueueTokenExampleValue,
  UserTokenExampleValue,
} from '../../shared/share.openapi'

@Controller('v1/concerts')
@ApiTags('Concerts')
export class ConcertsApiController {
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
    return
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
  createConcert() {
    return
  }

  @Post(':concert_id/seats/:seat_id/reservations')
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
  createReservation(
    @Param('concert_id') concertId: string,
    @Param('seat_id') seatId: string,
  ): Promise<SeatsResponseDto> {
    return
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
  createPayment(
    @Param('concert_id') concertId: string,
    @Param('seat_id') seatId: string,
  ): Promise<BillsResponseDto> {
    return
  }
}

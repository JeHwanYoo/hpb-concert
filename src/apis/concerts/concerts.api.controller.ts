import { Controller, Get, Param, Post } from '@nestjs/common'
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
  createConcert(): Promise<ConcertsResponseDto> {
    return
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
  createReservation(
    @Param('concert_id') concertId: string,
    @Param('seat_no') seatId: string,
  ): Promise<SeatsResponseDto> {
    return
  }

  @Post(':concert_id/seats/:seat_no/payments')
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
    @Param('seat_no') seatId: string,
  ): Promise<BillsResponseDto> {
    return
  }
}

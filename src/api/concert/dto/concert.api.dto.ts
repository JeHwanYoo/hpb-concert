import { ApiProperty } from '@nestjs/swagger'
import {
  ConcertCreationModel,
  ConcertModel,
} from '../../../domain/concert/model/concert.model'
import { SeatModel } from '../../../domain/seat/model/seat.model'
import { BillModel } from '../../../domain/bill/model/bill.model'

export class ConcertPostRequestDto implements ConcertCreationModel {
  @ApiProperty({
    type: Number,
    description: '최대 좌석수',
    minimum: 0,
  })
  capacity: number

  @ApiProperty({
    type: Number,
    description: '좌석 가격 (모두 동일하다고 가정)',
    minimum: 0,
  })
  price: number

  @ApiProperty({
    type: String,
    description: '예매시작일',
    format: 'date-time',
  })
  openingAt: Date

  @ApiProperty({
    type: String,
    description: '예매종료일',
    format: 'date-time',
  })
  closingAt: Date

  @ApiProperty({
    type: String,
    description: '콘서트 날짜',
    format: 'date-time',
  })
  eventDate: Date
}

export class ConcertResponseDto implements ConcertModel {
  @ApiProperty({
    type: String,
    description: 'UUID',
    format: 'uuid',
  })
  id: string

  @ApiProperty({
    type: Number,
    description: '최대 좌석수',
    minimum: 0,
  })
  capacity: number

  @ApiProperty({
    type: Number,
    description: '좌석 가격 (모두 동일하다고 가정)',
    minimum: 0,
  })
  price: number

  @ApiProperty({
    type: String,
    description: '생성일',
    format: 'date-time',
  })
  createdAt: Date

  @ApiProperty({
    type: String,
    description: '업데이트일',
    format: 'date-time',
  })
  updatedAt: Date

  @ApiProperty({
    type: String,
    description: '예매시작일',
    format: 'date-time',
  })
  openingAt: Date

  @ApiProperty({
    type: String,
    description: '예매종료일',
    format: 'date-time',
  })
  closingAt: Date

  @ApiProperty({
    type: String,
    description: '콘서트 날짜',
    format: 'date-time',
  })
  eventDate: Date
}

export class SeatResponseDto implements SeatModel {
  @ApiProperty({
    type: String,
    description: 'UUID',
    format: 'uuid',
    nullable: true,
  })
  id: string | null

  @ApiProperty({
    type: String,
    description: '좌석 소유자 UUID',
    format: 'uuid',
    nullable: true,
  })
  holderId: string | null

  @ApiProperty({
    type: String,
    description: '콘서트 UUID',
    format: 'uuid',
    nullable: true,
  })
  concertId: string

  @ApiProperty({
    type: String,
    description: '예약 날짜',
    format: 'date-time',
    nullable: true,
  })
  reservedAt: Date | null

  @ApiProperty({
    type: String,
    description: '예약 날짜',
    format: 'date-time',
    nullable: true,
  })
  deadline: Date | null

  @ApiProperty({
    type: String,
    description: '예약 날짜',
    format: 'date-time',
    nullable: true,
  })
  paidAt: Date | null

  @ApiProperty({
    type: Number,
    description: '좌석 번호',
  })
  seatNo: number
}

export class BillResponseDto implements BillModel {
  @ApiProperty({
    type: String,
    description: 'UUID',
    format: 'uuid',
  })
  id: string

  @ApiProperty({
    type: String,
    description: '좌석 UUID',
    format: 'uuid',
  })
  seatId: string

  @ApiProperty({
    type: String,
    description: '좌석 소유자 UUID',
    format: 'uuid',
  })
  holderId: string

  @ApiProperty({
    type: Number,
    description: '좌석 가격 (모두 동일하다고 가정)',
    minimum: 0,
  })
  amount: number

  @ApiProperty({
    type: String,
    description: '결제일',
    format: 'date-time',
  })
  createdAt: Date
}

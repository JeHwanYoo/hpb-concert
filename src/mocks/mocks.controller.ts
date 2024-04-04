import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common'
import { MockUserId } from './mocks.user-id.decorator'
import { JwtService } from '@nestjs/jwt'
import { addMinutes } from 'date-fns'
import { MockToken } from './mocks.token.decorator'
import { v4 as uuidv4 } from 'uuid'

@Controller('mocks')
export class MocksController {
  constructor(private readonly jwtService: JwtService) {}

  @Post('enqueues')
  async enqueue(@MockUserId() userId: string) {
    const now = new Date()
    return this.jwtService.signAsync({
      userId,
      expired_at: addMinutes(now, 99999),
      created_at: now,
    })
  }

  @Post('/concerts/:concert_id/seats/:seat_id/reservations')
  reserve(
    @MockToken() token: MockToken,
    @Param('concert_id') concert_id: string,
    @Param('seat_id') seat_id: string,
  ) {
    const now = new Date()
    return {
      id: seat_id,
      concert_id,
      row_name: 'A열',
      col_name: '18',
      price: 10000,
      reserved_at: now,
      deadline: addMinutes(now, 5),
    }
  }

  @Post('/concerts/:concert_id/seats/:seat_id/payments')
  pay(
    @MockToken() token: MockToken,
    @Param('concert_id') concert_id: string,
    @Param('seat_id') seat_id: string,
  ) {
    return {
      holder_id: token.user_id,
      seat_id,
      cost: 10000,
      created_at: new Date(),
    }
  }

  @Get('/concerts/:concert_id/seats')
  getSeats(
    @MockToken() token: MockToken,
    @Param('concert_id') concert_id: string,
  ) {
    return [
      {
        id: uuidv4(),
        concert_id,
        row_name: 'A열',
        col_name: '18',
        price: 10000,
      },
    ]
  }

  @Patch('charges')
  charge(@MockUserId() userId: string, @Body() body: { amount: number }) {
    return {
      userId,
      balance: 300000,
    }
  }

  @Get('charges')
  getCharges(@MockUserId() userId: string) {
    return {
      userId,
      balance: 300000,
    }
  }
}

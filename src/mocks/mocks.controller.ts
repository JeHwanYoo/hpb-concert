import { Controller, Get, Patch, Post } from '@nestjs/common'
import { MockUserId } from './mocks.user-id.decorator'
import { JwtService } from '@nestjs/jwt'
import { addMinutes } from 'date-fns'

@Controller('mocks')
export class MocksController {
  constructor(private readonly jwtService: JwtService) {}

  @Post('enqueues')
  async enqueue(@MockUserId() userId: string) {
    const now = new Date()
    return this.jwtService.signAsync({
      userId,
      expired_at: addMinutes(now, 5),
      created_at: now,
    })
  }

  @Post('seats/:seat_id/reservations')
  reserve() {
    return
  }

  @Get('seats')
  getSeats() {
    return
  }

  @Patch('charges')
  charge(@MockUserId() userId: string) {
    return
  }

  @Get('charges')
  getCharges(@MockUserId() userId: string) {
    return
  }

  @Post('payments')
  pay() {
    return
  }
}

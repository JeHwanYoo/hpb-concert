import { Controller, Get, Patch, Post } from '@nestjs/common'
import { MockUserId } from './mocks.user-id.decorator'

@Controller('mocks')
export class MocksController {
  @Post('enqueues')
  enqueue(@MockUserId() userId: string) {
    return
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

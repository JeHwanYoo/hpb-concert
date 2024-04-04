import { Controller, Get, Patch, Post } from '@nestjs/common'

@Controller('mocks')
export class MocksController {
  @Post('enqueues')
  enqueue() {
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
  charge() {
    return
  }

  @Get('charges')
  getCharges() {
    return
  }

  @Post('payments')
  pay() {
    return
  }
}

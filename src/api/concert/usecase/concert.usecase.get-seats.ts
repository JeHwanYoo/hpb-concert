import { Injectable } from '@nestjs/common'
import { SeatModel } from '../../../domain/seat/model/seat.model'
import { SeatService } from '../../../domain/seat/seat.service'

@Injectable()
export class ConcertUsecaseGetSeats {
  constructor(private readonly seatService: SeatService) {}

  execute(concertId: string): Promise<SeatModel[]> {
    return this.seatService.findManyBy({
      concertId,
    })
  }
}

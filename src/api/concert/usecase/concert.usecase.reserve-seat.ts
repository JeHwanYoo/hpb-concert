import { BadRequestException, Injectable } from '@nestjs/common'
import { isFuture, isPast } from 'date-fns'
import { DomainException } from '../../../shared/shared.exception'
import { SeatService } from '../../../domain/seat/seat.service'
import { ConcertService } from '../../../domain/concert/concert.service'
import { SeatResponseDto } from '../dto/concert.api.dto'

@Injectable()
export class ConcertUsecaseReserveSeat {
  constructor(
    private readonly concertService: ConcertService,
    private readonly seatsService: SeatService,
  ) {}

  async execute(
    holderId: string,
    concertId: string,
    seatNo: number,
  ): Promise<SeatResponseDto> {
    const concert = await this.concertService.findOneBy({ id: concertId })

    if (seatNo < 0 || seatNo > concert.capacity - 1) {
      throw new BadRequestException('Invalid SeatNo')
    }

    if (isFuture(concert.openingAt)) {
      throw new BadRequestException('Not Open')
    }

    if (isPast(concert.closingAt)) {
      throw new BadRequestException('Closed')
    }

    try {
      return await this.seatsService.reserve({
        holderId,
        concertId,
        seatNo,
      })
    } catch (e) {
      if (e instanceof DomainException) {
        throw new BadRequestException(e.message, { cause: e })
      }

      throw e
    }
  }
}

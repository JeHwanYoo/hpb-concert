import { BadRequestException, Injectable } from '@nestjs/common'
import { ConcertsService } from '../../domains/concerts/concerts.service'
import { ConcertsResponseDto } from './dto/concerts.api.dto'
import { ConcertCreationModel } from '../../domains/concerts/models/concert.model'
import { SeatsService } from '../../domains/seats/seats.service'
import { SeatModel } from '../../domains/seats/models/seat.model'
import { isFuture, isPast } from 'date-fns'
import { DomainException } from '../../shared/shared.exception'

@Injectable()
export class ConcertsApiUseCase {
  constructor(
    private readonly concertsService: ConcertsService,
    private readonly seatsService: SeatsService,
  ) {}

  createConcert(model: ConcertCreationModel): Promise<ConcertsResponseDto> {
    return this.concertsService.create(model)
  }

  getConcerts(): Promise<ConcertsResponseDto[]> {
    return this.concertsService.findManyBy({})
  }

  /**
   *
   * @param holderId
   * @param concertId
   * @param seatNo
   * @throws BadRequestException Invalid SeatNo
   * @throws BadRequestException Not Open
   * @throws BadRequestException Closed
   */
  async reserveSeat(
    holderId: string,
    concertId: string,
    seatNo: number,
  ): Promise<SeatModel> {
    const concert = await this.concertsService.findOneBy({ id: concertId })

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

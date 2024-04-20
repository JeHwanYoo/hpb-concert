import { BadRequestException, Injectable } from '@nestjs/common'
import { ConcertsService } from '../../domains/concerts/concerts.service'
import { ConcertsResponseDto } from './dto/concerts.api.dto'
import { ConcertCreationModel } from '../../domains/concerts/models/concert.model'
import { SeatsService } from '../../domains/seats/seats.service'
import { SeatModel } from '../../domains/seats/models/seat.model'
import { isFuture, isPast } from 'date-fns'
import { DomainException } from '../../shared/shared.exception'
import { ChargesService } from '../../domains/charges/charges.service'
import { BillModel } from '../../domains/bills/models/bill.model'
import { BillsService } from '../../domains/bills/bills.service'

@Injectable()
export class ConcertsApiUseCase {
  constructor(
    private readonly concertsService: ConcertsService,
    private readonly seatsService: SeatsService,
    private readonly chargesService: ChargesService,
    private readonly billsService: BillsService,
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

  // todo rollback
  async paySeat(
    holderId: string,
    concertId: string,
    seatId: string,
  ): Promise<BillModel> {
    const concert = await this.concertsService.findOneBy({ id: concertId })

    try {
      await this.chargesService.use(holderId, {
        amount: concert.price,
      })
      await this.seatsService.pay(seatId, holderId)
    } catch (e) {
      if (e instanceof DomainException) {
        throw new BadRequestException(e.message, { cause: e })
      }
      throw e
    }

    return this.billsService.create({
      holderId,
      seatId,
      amount: concert.price,
    })
  }
}

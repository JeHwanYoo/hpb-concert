import { BadRequestException, Injectable } from '@nestjs/common'
import { ConcertService } from '../../domain/concert/concert.service'
import { ConcertResponseDto } from './dto/concert.api.dto'
import { ConcertCreationModel } from '../../domain/concert/model/concert.model'
import { SeatService } from '../../domain/seat/seat.service'
import { SeatModel } from '../../domain/seat/model/seat.model'
import { isFuture, isPast } from 'date-fns'
import { DomainException } from '../../shared/shared.exception'
import { ChargeService } from '../../domain/charge/charge.service'
import { BillModel } from '../../domain/bill/model/bill.model'
import { BillService } from '../../domain/bill/bill.service'

@Injectable()
export class ConcertApiUseCase {
  constructor(
    private readonly concertService: ConcertService,
    private readonly seatsService: SeatService,
    private readonly chargeService: ChargeService,
    private readonly billService: BillService,
  ) {}

  createConcert(model: ConcertCreationModel): Promise<ConcertResponseDto> {
    return this.concertService.create(model)
  }

  getConcerts(): Promise<ConcertResponseDto[]> {
    return this.concertService.findManyBy({})
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

  // todo rollback
  async paySeat(
    holderId: string,
    concertId: string,
    seatId: string,
  ): Promise<BillModel> {
    const concert = await this.concertService.findOneBy({ id: concertId })

    try {
      await this.chargeService.use(holderId, {
        amount: concert.price,
      })
      await this.seatsService.pay(seatId, holderId)
    } catch (e) {
      if (e instanceof DomainException) {
        throw new BadRequestException(e.message, { cause: e })
      }
      throw e
    }

    return this.billService.create({
      holderId,
      seatId,
      amount: concert.price,
    })
  }

  async getSeatsByConcertId(concertId: string): Promise<SeatModel[]> {
    return this.seatsService.findManyBy({
      concertId,
    })
  }
}

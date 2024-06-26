import { ConcertService } from '../../../domain/concert/concert.service'
import { BadRequestException, Injectable } from '@nestjs/common'
import { BillModel } from '../../../domain/bill/model/bill.model'
import { DomainException } from '../../../shared/shared.exception'
import { ChargeService } from '../../../domain/charge/charge.service'
import { SeatService } from '../../../domain/seat/seat.service'
import { BillService } from '../../../domain/bill/bill.service'

@Injectable()
export class ConcertUsecasePaySeat {
  constructor(
    private readonly concertService: ConcertService,
    private readonly seatService: SeatService,
    private readonly chargeService: ChargeService,
    private readonly billService: BillService,
  ) {}

  async execute(
    holderId: string,
    concertId: string,
    seatNo: number,
  ): Promise<BillModel> {
    const concert = await this.concertService.findOneBy({ id: concertId })

    // @todo Saga Pattern 도입
    try {
      await this.chargeService.use(holderId, {
        amount: concert.price,
      })
      const paidSeat = await this.seatService.pay(seatNo, concertId, holderId)

      return await this.billService.create({
        holderId,
        seatId: paidSeat.id,
        amount: concert.price,
      })
    } catch (e) {
      if (e instanceof DomainException) {
        throw new BadRequestException(e.message, { cause: e })
      }
      throw e
    }
  }
}

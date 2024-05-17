import { ConcertResponseDto } from '../dto/concert.api.dto'
import { ConcertService } from '../../../domain/concert/concert.service'
import { Injectable } from '@nestjs/common'

@Injectable()
export class ConcertUsecaseGetConcerts {
  constructor(private readonly concertService: ConcertService) {}

  execute(): Promise<ConcertResponseDto[]> {
    return this.concertService.findManyBy({})
  }
}

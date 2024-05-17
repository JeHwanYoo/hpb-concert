import {
  ConcertPostRequestDto,
  ConcertResponseDto,
} from '../dto/concert.api.dto'
import { ConcertService } from '../../../domain/concert/concert.service'
import { Injectable } from '@nestjs/common'

@Injectable()
export class ConcertUsecaseCreateConcert {
  constructor(private readonly concertService: ConcertService) {}

  execute(dto: ConcertPostRequestDto): Promise<ConcertResponseDto> {
    return this.concertService.create(dto)
  }
}

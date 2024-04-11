import { Injectable } from '@nestjs/common'
import { EnqueuesService } from '../../domains/enqueues/enqueues.service'

@Injectable()
export class EnqueuesApiUseCase {
  constructor(private readonly enqueuesService: EnqueuesService) {}
}

import { Injectable } from '@nestjs/common'

export interface EnqueuesServiceProps {
  /**
   * @description Throughput per minute
   */
  throughputPerMinute: number
}

@Injectable()
export class EnqueuesService {
  constructor(private readonly props: EnqueuesServiceProps) {}
}

import { beforeEach, describe, expect, it } from 'vitest'
import { Test, TestingModule } from '@nestjs/testing'
import { EnqueuesService } from './enqueues.service'

describe('EnqueuesService', () => {
  const throughputPerMinute = 100
  let service: EnqueuesService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: EnqueuesService,
          useValue: new EnqueuesService({
            throughputPerMinute,
          }),
        },
      ],
    }).compile()

    service = module.get<EnqueuesService>(EnqueuesService)
  })

  it('should be defined', () => {
    expect(service).to.be.a('object')
  })
})

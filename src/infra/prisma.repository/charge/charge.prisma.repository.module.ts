import { Module } from '@nestjs/common'
import { ChargePrismaRepository } from './charge.prisma.repository'
import { ChargeRepositoryToken } from '../../../domain/charge/charge.repository'
import { PrismaModule } from '../../prisma.connection/prisma.module'

@Module({
  imports: [PrismaModule],
  providers: [
    {
      provide: ChargeRepositoryToken,
      useClass: ChargePrismaRepository,
    },
  ],
  exports: [ChargeRepositoryToken],
})
export class ChargePrismaRepositoryModule {}

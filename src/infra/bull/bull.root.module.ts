import { Module } from '@nestjs/common'
import { BullModule } from '@nestjs/bull'
import * as Process from 'process'

@Module({
  imports: [
    BullModule.forRoot({
      redis: {
        host: Process.env.REDIS_HOST,
        port: Number(Process.env.REDIS_PORT),
      },
    }),
  ],
})
export class BullRootModule {}

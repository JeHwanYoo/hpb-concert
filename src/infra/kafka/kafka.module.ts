import { Module } from '@nestjs/common'
import { ClientsModule, Transport } from '@nestjs/microservices'
import { KAFKA_NAME, KAFKA_OPTIONS } from './kafka.config'

@Module({
  imports: [
    ClientsModule.register([
      {
        name: KAFKA_NAME,
        transport: Transport.KAFKA,
        options: KAFKA_OPTIONS,
      },
    ]),
  ],
})
export class KafkaModule {}

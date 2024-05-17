import { Module } from '@nestjs/common'
import { ClientsModule, Transport } from '@nestjs/microservices'
import { kafkaName, kafkaOptions } from './kafka.config'

@Module({
  imports: [
    ClientsModule.register([
      {
        name: kafkaName,
        transport: Transport.KAFKA,
        options: kafkaOptions,
      },
    ]),
  ],
})
export class KafkaModule {}

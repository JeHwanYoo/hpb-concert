import { KafkaOptions } from '@nestjs/microservices'

export const KAFKA_OPTIONS: KafkaOptions['options'] = {
  client: {
    clientId: 'nestjs',
    brokers: [process.env.KAFKA_CONNECTION_STRING],
  },
  consumer: {
    groupId: 'nestjs-consumer',
  },
}

export const KAFKA_NAME = 'KAFKA_CLIENT'

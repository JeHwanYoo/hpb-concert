import { KafkaOptions } from '@nestjs/microservices'

export const kafkaOptions: KafkaOptions['options'] = {
  client: {
    clientId: 'nestjs',
    brokers: [process.env.KAFKA_CONNECTION_STRING],
  },
  consumer: {
    groupId: 'nestjs-consumer',
  },
}

export const kafkaName = 'KAFKA_CLIENT'

import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { VersioningType } from '@nestjs/common'
import { MicroserviceOptions, Transport } from '@nestjs/microservices'
import { kafkaOptions } from './infra/kafka/kafka.config'

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({
      logger: true,
    }),
  )

  // Kafka 설정
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: kafkaOptions,
  })

  // Versioning 설정
  app.enableVersioning({
    type: VersioningType.URI,
    prefix: 'v',
  })

  const config = new DocumentBuilder()
    .setTitle('콘서트 예약')
    .setDescription('콘서트 예약 시나리오 구현')
    .setVersion('1.0')
    .build()
  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('docs', app, document)

  await app.listen(3000, '0.0.0.0')
}

bootstrap().catch(console.error)

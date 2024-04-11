import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import * as fs from 'node:fs/promises'
import * as path from 'node:path'

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({
      logger: true,
    }),
  )

  const config = new DocumentBuilder()
    .setTitle('콘서트 예약')
    .setDescription('콘서트 예약 시나리오 구현')
    .setVersion('1.0')
    .build()
  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('docs', app, document)

  fs.writeFile(
    path.resolve('docs', 'swagger-spec.json'),
    JSON.stringify(document),
  )
    .then(() => console.log('Swagger Exported'))
    .catch(console.error)

  await app.listen(3000, '0.0.0.0')
}

bootstrap().catch(console.error)

import { Module } from '@nestjs/common'
import { MocksController } from './mocks.controller'
import { JwtModule } from '@nestjs/jwt'

@Module({
  imports: [JwtModule.register({ secret: 'mock' })],
  controllers: [MocksController],
})
export class MocksModule {}

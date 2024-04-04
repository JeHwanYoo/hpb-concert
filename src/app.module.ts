import { Module } from '@nestjs/common'
import { MocksModule } from './mocks/mocks.module'

@Module({
  imports: [MocksModule],
  controllers: [],
  providers: [],
})
export class AppModule {}

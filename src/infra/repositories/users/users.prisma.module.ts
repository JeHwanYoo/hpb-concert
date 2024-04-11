import { Module } from '@nestjs/common'
import { UsersPrismaRepository } from './users.prisma.repository'
import { PrismaModule } from '../../prisma/prisma.module'

@Module({
  imports: [PrismaModule],
  providers: [UsersPrismaRepository],
  exports: [UsersPrismaRepository],
})
export class UsersPrismaModule {}

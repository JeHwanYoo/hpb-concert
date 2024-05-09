import { Module } from '@nestjs/common'
import { UserPrismaRepository } from './user.prisma.repository'
import { PrismaModule } from '../../prisma/prisma.module'

@Module({
  imports: [PrismaModule],
  providers: [UserPrismaRepository],
  exports: [UserPrismaRepository],
})
export class UserPrismaModule {}

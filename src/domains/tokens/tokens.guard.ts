import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { EnqueueTokenModel } from './models/enqueueTokenModel'
import { differenceInSeconds } from 'date-fns'

@Injectable()
export class UserTokensGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest()

    const authHeader = request.headers['authorization']

    if (!authHeader) throw new UnauthorizedException()

    if (!authHeader.startsWith('Bearer ')) throw new UnauthorizedException()

    const token = authHeader.split(' ')[1]

    try {
      await this.jwtService.verifyAsync(token)
      return true
    } catch (e) {
      throw new UnauthorizedException(e.message)
    }
  }
}

@Injectable()
export class EnqueueTokensGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest()

    const authHeader = request.headers['authorization']

    if (!authHeader) throw new UnauthorizedException()

    if (!authHeader.startsWith('Bearer ')) throw new UnauthorizedException()

    const token = authHeader.split(' ')[1]

    let verified: EnqueueTokenModel
    try {
      verified = await this.jwtService.verifyAsync<EnqueueTokenModel>(token)
    } catch (e) {
      throw new UnauthorizedException(e.message)
    }

    const now = new Date()
    const availableDate = new Date(verified.availableTime * 1000)
    if (differenceInSeconds(now, availableDate) < 0) {
      throw new BadRequestException('Insufficient Entry Time.')
    }
    if (verified.completed) {
      throw new BadRequestException('Session Completed')
    }

    return true
  }
}

import {
  createParamDecorator,
  ExecutionContext,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'

export interface MockToken {
  user_id: string
  expired_at: string
  created_at: string
}

export const MockToken = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest()
    const authorization = request.headers['authorization']
    const jwtService = new JwtService({ secret: 'mock' })
    const jwt = authorization?.split(' ')[1]

    if (!jwt) {
      throw new UnauthorizedException('Unauthorized')
    }

    const payload = jwtService.decode<MockToken>(jwt)

    if (
      !payload.expired_at ||
      new Date(payload.expired_at).getTime() < new Date().getTime()
    ) {
      throw new ForbiddenException('Token expired')
    }

    return payload
  },
)

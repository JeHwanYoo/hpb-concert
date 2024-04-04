import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'

export const MockUserId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest()
    const authorization = request.headers['authorization']
    const jwtService = new JwtService({ secret: 'mock' })
    const jwt = authorization?.split(' ')[1]

    if (!jwt) {
      throw new UnauthorizedException('Unauthorized')
    }

    const payload = jwtService.decode<{ user_id?: string }>(jwt)

    if (!payload.user_id) {
      throw new UnauthorizedException()
    }

    return payload.user_id
  },
)

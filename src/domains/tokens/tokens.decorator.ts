import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'

export const DecodedToken = createParamDecorator(
  <T>(_: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest()
    const jwtService = new JwtService()

    const token = request.headers['authorization'].split(' ')[1]

    return jwtService.decode<T>(token)
  },
)

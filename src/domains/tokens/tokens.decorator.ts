import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { UserTokenModel } from './models/enqueueTokenModel'

export const DecodedToken = createParamDecorator(
  (_: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest()
    const jwtService = new JwtService()

    const token = request.headers['authorization'].split(' ')[1]

    return jwtService.decode<UserTokenModel>(token)
  },
)

import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'

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

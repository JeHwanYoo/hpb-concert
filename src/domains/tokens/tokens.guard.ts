import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'

@Injectable()
export class UserTokensGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest()

    const authHeader = request.headers['authorization']

    if (!authHeader) return false

    if (!authHeader.startsWith('Bearer ')) return false

    const token = authHeader.split(' ')[1]

    try {
      await this.jwtService.verifyAsync(token)
      return true
    } catch (e) {
      return false
    }
  }
}

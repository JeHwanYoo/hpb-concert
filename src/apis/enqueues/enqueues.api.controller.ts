import { Controller, Post, UseGuards } from '@nestjs/common'
import {
  ApiCreatedResponse,
  ApiHeader,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger'
import {
  EnqueueTokenExampleValue,
  UserTokenExampleValue,
} from '../../shared/share.openapi'
import { EnqueuesApiUseCase } from './enqueues.api.use.case'
import { UserTokensGuard } from '../../domains/tokens/tokens.guard'
import { DecodedToken } from '../../domains/tokens/tokens.decorator'
import { UserTokenModel } from '../../domains/tokens/models/enqueueTokenModel'

@Controller('v1/enqueues')
@ApiTags('Enqueues')
export class EnqueuesApiController {
  constructor(private readonly enqueuesApiUseCase: EnqueuesApiUseCase) {}

  @Post()
  @ApiOperation({
    description: '대기열 토큰 발급 API',
  })
  @ApiHeader({
    name: 'Authorization',
    description: 'User Bearer token (JWT)',
    required: true,
    schema: {
      type: 'string',
      example: `Bearer ${UserTokenExampleValue}`,
    },
  })
  @ApiCreatedResponse({
    description:
      'Enqueue Bearer token (JWT)<br/>토큰은 `입장 가능 시간`, `만료 시간`을 포함하고 있음',
    schema: {
      type: 'string',
      example: EnqueueTokenExampleValue,
    },
  })
  @ApiUnauthorizedResponse()
  @UseGuards(UserTokensGuard)
  enqueues(
    @DecodedToken<UserTokenModel>() decodedUserToken: UserTokenModel,
  ): Promise<string> {
    return this.enqueuesApiUseCase.createToken(decodedUserToken.userId)
  }
}

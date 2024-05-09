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
} from '../../shared/shared.openapi'
import { EnqueueApiUseCase } from './enqueue.api.use-case'
import { UserTokensGuard } from '../../domain/tokens/tokens.guard'
import { DecodedToken } from '../../domain/tokens/tokens.decorator'
import { UserTokenModel } from '../../domain/tokens/model/enqueueTokenModel'

@Controller('v1/enqueue')
@ApiTags('Enqueues')
export class EnqueueApiController {
  constructor(private readonly enqueuesApiUseCase: EnqueueApiUseCase) {}

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
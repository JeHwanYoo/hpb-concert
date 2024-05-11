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
import { DecodedToken } from '../../domain/token/token.decorator'
import { UserTokenModel } from '../../domain/token/model/token.model'
import { UserTokenGuard } from '../../domain/token/token.guard'
import { EnqueueApiCreateToken } from './usecase/enqueue.api.create-token'

@Controller('v1/enqueues')
@ApiTags('Enqueues')
export class EnqueueApiController {
  constructor(private readonly enqueueApiCreateToken: EnqueueApiCreateToken) {}

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
  @UseGuards(UserTokenGuard)
  async enqueue(
    @DecodedToken<UserTokenModel>() decodedUserToken: UserTokenModel,
  ): Promise<string> {
    try {
      return await this.enqueueApiCreateToken.execute(decodedUserToken.userId)
    } catch (e) {
      console.error(e)
      throw e
    }
  }
}

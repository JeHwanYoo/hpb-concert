import { Controller, Post } from '@nestjs/common'
import {
  ApiCreatedResponse,
  ApiHeader,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger'

@Controller('v1/enqueues')
@ApiTags('Enqueues')
export class EnqueuesController {
  @Post()
  @ApiOperation({
    description: '대기열 토큰 발급 API',
  })
  @ApiHeader({
    name: 'Authorization',
    description: 'User Bearer token (JWT)',
    schema: {
      type: 'string',
      example:
        'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIwYjIzOTQ4OC00ZmE0LTQzMzQtYmE3MC04YTZmYmU4MDU5MmMiLCJleHBpcmVkX2F0IjoiMjAyNC0wNi0xMlQyMzozNjoxNS4zNTRaIiwiY3JlYXRlZF9hdCI6IjIwMjQtMDQtMDRUMTI6NTc6MTUuMzU0WiIsImlhdCI6MTcxMjIzNTQzNX0.Gywvr6ZpT0tPhgqrpTLB3pfu36rh_eNmZWF0rtRUUDk',
    },
  })
  @ApiCreatedResponse({
    description:
      'Enqueue Bearer token (JWT)<br/>토큰은 `입장 가능 시간`, `만료 시간`을 포함하고 있음',
    schema: {
      type: 'string',
      example:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIwYjIzOTQ4OC00ZmE0LTQzMzQtYmE3MC04YTZmYmU4MDU5MmMiLCJleHBpcmVkX2F0IjoiMjAyNC0wNi0xMlQyMzozODoyNC44MDhaIiwiY3JlYXRlZF9hdCI6IjIwMjQtMDQtMDRUMTI6NTk6MjQuODA4WiIsImlhdCI6MTcxMjIzNTU2NH0.2OHmzbGoHoA6PTeW5_g0LkMgQavOWtt9reryAPmXuV4',
    },
  })
  enqueues(): string {
    return
  }
}

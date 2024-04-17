import { GenericContainer } from 'testcontainers'
import { execSync } from 'child_process'
import { PrismaService } from '../infra/prisma/prisma.service'
import Redis from 'ioredis'
import * as process from 'process'

/**
 * Prepare a TestContainer for setting up a PostgreSQL instance.
 *
 * Due to the use of Docker image,
 * consider setting a timeout of more than one minute for the initial run.
 */
export function setUpPrismaIntegratedTest(
  cb: (prisma: PrismaService) => Promise<void>,
) {
  return async () => {
    // Initialize the container
    const container = await new GenericContainer('postgres:latest')
      .withExposedPorts(5432)
      .withEnvironment({
        POSTGRES_USER: 'user',
        POSTGRES_PASSWORD: 'password',
        POSTGRES_DB: 'test',
      })
      .start()

    // Get the mappedPort from the container and Set the DATABASE_URL
    const mappedPort = container.getMappedPort(5432)
    process.env.DATABASE_URL = `postgresql://user:password@localhost:${mappedPort}/test?schema=public`

    // Migrate TestContainer and PostgreSQL image
    execSync('npx prisma migrate dev', {
      env: {
        ...process.env,
        DATABASE_URL: process.env.DATABASE_URL,
      },
    })

    const prisma = new PrismaService()

    await cb(prisma)
  }
}

/**
 * Prepare a TestContainer for setting up a Redis instance
 *
 * Due to the use of Docker image,
 * consider setting a timeout of more than one minute for the initial run.
 */
export function setUpRedisIntegratedTest(cb: (redis: Redis) => Promise<void>) {
  return async () => {
    // Initialize the container
    const container = await new GenericContainer('redis:latest')
      .withExposedPorts(6379)
      .start()

    // Get the mappedPort from the container and Set the environment
    process.env.REDIS_HOST = container.getHost()
    process.env.REDIS_PORT = `${container.getMappedPort(6379)}`

    // Get connection
    const redis = new Redis({
      host: container.getHost(),
      port: container.getMappedPort(6379),
    })

    await cb(redis)
  }
}

/**
 * Run setUp stages sequentially
 * @param stages
 */
export async function setUpPipeline(
  ...stages: ((...args: unknown[]) => Promise<void>)[]
) {
  for (const setUp of stages) {
    await setUp()
  }
}

export function assertAllFulfilled<T>(
  settledResults: PromiseSettledResult<T>[],
): settledResults is PromiseFulfilledResult<T>[] {
  return !settledResults.some(r => r.status !== 'fulfilled')
}

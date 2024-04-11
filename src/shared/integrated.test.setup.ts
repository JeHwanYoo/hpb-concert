import { GenericContainer } from 'testcontainers'
import { execSync } from 'child_process'
import { PrismaService } from '../infra/prisma/prisma.service'

/**
 * Prepare a TestContainer for setting up a PostgreSQL instance.
 *
 * Due to the use of Docker image,
 * consider setting a timeout of more than one minute for the initial run.
 */
export async function setUpPrismaIntegratedTest(
  cb: (prisma: PrismaService) => Promise<void>,
) {
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

export function assertAllFulfilled<T>(
  settledResults: PromiseSettledResult<T>[],
): settledResults is PromiseFulfilledResult<T>[] {
  return !settledResults.some(r => r.status !== 'fulfilled')
}

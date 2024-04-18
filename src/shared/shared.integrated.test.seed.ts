import { UserModel } from '../domains/users/models/user.model'
import { ConcertModel } from '../domains/concerts/models/concert.model'
import { PrismaService } from '../infra/prisma/prisma.service'
import { faker } from '@faker-js/faker'

/**
 *
 * @param prisma
 * @param n
 * @description seed users using integrated test
 */
export function seedUsers(
  prisma: PrismaService,
  n: number = 30,
): Promise<UserModel[]> {
  return Promise.all(
    Array.from({ length: n }, () => {
      return prisma.user.create({
        data: {
          name: faker.person.firstName(),
        },
      })
    }),
  )
}

/**
 *
 * @param prisma
 * @param n
 * @description seed concerts using integrated test
 */
export function seedConcerts(
  prisma: PrismaService,
  n: number = 5,
): Promise<ConcertModel[]> {
  return Promise.all(
    Array.from({ length: n }, () => {
      const openingAt = faker.date.soon({ refDate: new Date() })
      const closingAt = faker.date.soon({ refDate: openingAt })
      const eventDate = faker.date.soon({ refDate: closingAt, days: 15 })
      return prisma.concert.create({
        data: {
          capacity: faker.number.int(10),
          price:
            Math.round(faker.number.int({ min: 10000, max: 100000 }) / 1000) *
            1000,
          openingAt,
          closingAt,
          eventDate,
        },
      })
    }),
  )
}
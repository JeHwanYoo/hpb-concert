import { UserModel } from '../domain/user/model/user.model'
import { ConcertModel } from '../domain/concert/model/concert.model'
import { PrismaService } from '../infra/prisma/prisma.service'
import { faker } from '@faker-js/faker'
import { SeatModel } from '../domain/seat/model/seat.model'

/**
 *
 * @param prisma
 * @param n
 * @description seed user using integrated test
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
 * @description seed concert using integrated test
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

let uniqueSeatNo = 0

export function seedSeats(
  prisma: PrismaService,
  userPool: UserModel[],
  concertPool: ConcertModel[],
  n: number = 5,
): Promise<SeatModel[]> {
  return Promise.all(
    Array.from({ length: n }, () => {
      const holderId = faker.helpers.arrayElement(userPool).id
      const concertId = faker.helpers.arrayElement(concertPool).id
      return prisma.seat.create({
        data: {
          seatNo: uniqueSeatNo++,
          holderId,
          concertId,
        },
      })
    }),
  )
}

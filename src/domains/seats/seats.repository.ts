import {
  SeatCreationModel,
  SeatModel,
  SeatUpdatingModel,
} from './models/seat.model'

export const SeatsRepositoryToken = 'SeatRepository'

export interface SeatsRepository {
  create<S = unknown>(
    creationModel: SeatCreationModel,
    connectingSession: S,
  ): Promise<SeatModel>

  find(concertId: string): Promise<SeatModel[]>

  /**
   *
   * @param seatNo
   * @param connectingSession
   * @description
   * 아직 생성되지 않아도 seatNo 에 대한 개념이 존재
   * DB에 존재할 경우 -> DB 인스턴스 반환
   * DB에 없을 경우 -> 논리적으로 반환
   */
  findOneBySeatNo<S = unknown>(
    seatNo: number,
    connectingSession?: S,
  ): Promise<SeatModel>

  /**
   *
   * @param seatId
   * @param connectingSession
   * @description
   * seatId 가 존재한다는 것은 최소 한번 이상 예약 되었음을 보장함
   * 존재하지 않으면 null 반환
   */
  findOneBySeatId<S = unknown>(
    seatId: string,
    connectingSession?: S,
  ): Promise<SeatModel | null>

  update<S = unknown>(
    seatId: string,
    updatingModel: SeatUpdatingModel,
    connectingSession: S,
  ): Promise<SeatModel>

  withTransaction<T, S = unknown>(
    cb: (connectingSession: S) => Promise<T>,
  ): Promise<T>
}

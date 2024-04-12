import {
  SeatCreationModel,
  SeatModel,
  SeatUpdatingModel,
} from './models/seat.model'

export const SeatsRepositoryToken = 'SeatRepository'

export interface SeatsRepository {
  create(creationModel: SeatCreationModel): Promise<SeatModel>

  find(concertId: string): Promise<SeatModel[]>

  /**
   *
   * @param seatNo
   * @description
   * 아직 생성되지 않아도 seatNo 에 대한 개념이 존재
   * DB에 존재할 경우 -> DB 인스턴스 반환
   * DB에 없을 경우 -> 논리적으로 반환
   */
  findOneBySeatNo(seatNo: number): Promise<SeatModel>

  update(seatId: string, updatingModel: SeatUpdatingModel): Promise<SeatModel>
}

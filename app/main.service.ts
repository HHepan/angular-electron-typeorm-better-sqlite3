import {AppDataSource} from "./data-source";
import {RecordType} from "./entity/record-type";

export class MainService {
  recordTypeRepo = AppDataSource.getRepository(RecordType);
  // 更新每个record的上次更新时间
  async updateTime(data: {lineId: number | undefined, recordTypeName: string}) {
    if (data.lineId !== undefined) {
      const recordType = await this.recordTypeRepo.findOne({where: {name: data.recordTypeName, line: {id: data.lineId}}});
      if (recordType) {
        recordType.updateTime = new Date().getTime();
      }
      return this.recordTypeRepo.save(recordType!);
    }
  };
}

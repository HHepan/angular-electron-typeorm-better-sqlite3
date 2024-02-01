import {IpcMainInvokeEvent} from "electron";
import {Line} from "../entity/line";
import {AppDataSource} from "../data-source";
import {Location} from "../entity/location";
import {mainService} from "../main";
import {EventsCenter} from "../events.center";
import {Score} from "../entity/score";
import {DielectricParameter} from "../entity/dielectric-parameter";
import {DielectricParameterItem} from "../entity/dielectric-parameter-item";
import {RecordType} from "../entity/record-type";
import {recordKey} from "../../src/app/key";

export class LineRepository {
  _baseUrl = 'line';
  constructor(private eventsCenter: EventsCenter) {
    this.loadEvents()
  }

  addEvent(eventKey: string, listener: (event: IpcMainInvokeEvent, ...args: any[]) => (Promise<void>) | (any)): void {
    this.eventsCenter.registerEvent(`${this._baseUrl}-${eventKey}`, listener);
  }

  loadEvents(): void {
    const lineRepo = AppDataSource.getRepository(Line);
    const recordTypeRepo = AppDataSource.getRepository(RecordType);
    const locationRepo = AppDataSource.getRepository(Location);
    const scoreRepo = AppDataSource.getRepository(Score);
    const DielectricParameterRepo = AppDataSource.getRepository(DielectricParameter);
    const DielectricParameterItemRepo = AppDataSource.getRepository(DielectricParameterItem);

    this.addEvent('getAll', (event, searchName: string) => {
      if (searchName === undefined) {
        return lineRepo.find();
      } else {
        return lineRepo.createQueryBuilder("line")
          .where("name LIKE :param")
          .setParameters({
            param: '%' + searchName + '%'
          }).orderBy("id", "DESC").getMany();
      }
    });

    this.addEvent('getById', (event: any, lineId: number) => {
        return lineRepo.findOne({where: {id: lineId}, relations: ["location1", "location2", "recordTypes"]});
    });

    this.addEvent('add', async (event: any, _line: Line) => {
      if (_line.location1 !== undefined && _line.location2 !== undefined ) {
        await locationRepo.save(_line.location1);
        await locationRepo.save(_line.location2);
      }

      const recordType = new RecordType();
      recordType.name = recordKey.score;
      recordType.updateTime = new Date().getTime();
      await recordTypeRepo.save(recordType);

      const line = lineRepo.create(_line);
      line.location1 = _line.location1;
      line.location2 = _line.location2;
      line.recordTypes = [recordType];
      await lineRepo.save(line);
      return lineRepo.find();
    });

    this.addEvent('update', async (event: any, lineId: number, newLine: Line) => {
      const location1 = await locationRepo.findOne({where: {id: newLine.location1?.id}});
      if (location1 !== null) {
        location1.longitude = newLine.location1?.longitude;
        location1.latitude = newLine.location1?.latitude;
        await locationRepo.save(location1);
      }
      const location2 = await locationRepo.findOne({where: {id: newLine.location2?.id}});
      if (location2 !== null) {
        location2.longitude = newLine.location2?.longitude;
        location2.latitude = newLine.location2?.latitude;
        await locationRepo.save(location2);
      }

      const line = await lineRepo.findOne({where: {id: lineId}});
      if (line !== null) {
        line.name = newLine.name;
        line.voltage = newLine.voltage;
        line.length = newLine.length;
        line.createTime = newLine.createTime;
        line.location1 = newLine.location1;
        line.location2 = newLine.location2;
        await lineRepo.save(line);
      }
      return lineRepo.find();
    });

    this.addEvent('update-types', async (event: any, lineId: number, newTypes: string) => {
      const line = await lineRepo.findOne({where: {id: lineId}});
      if (line !== null) {
        line.types = newTypes;
        await lineRepo.save(line);
      }
      return lineRepo.find();
    });

    this.addEvent('deleteById', async (event: any, _line: Line) => {
      const line = await lineRepo.create(_line);
      await lineRepo.remove(line);
      return lineRepo.find();
    });

    this.addEvent('updateLineRecordTypes', async (event: any, lineId: number, recordTypes: string[]) => {
      const line = await lineRepo.findOne({where: {id: lineId}, relations: {recordTypes: true}});
      const lineRecordTypes = line?.recordTypes?.map(recordType => recordType.name);
      // 需要添加的, 在recordTypes但不在line.recordTypes
      const toBeAdded = recordTypes.filter(recordType => !lineRecordTypes?.includes(recordType));
      // 需要删除的，在line.recordTypes但不在recordTypes
      const toBeDeleted = lineRecordTypes?.filter(lineRecordType => !recordTypes.includes(lineRecordType!));
      const toBeDeletedIds = [] as number[];
      line?.recordTypes?.forEach(recordType => {
        if (toBeDeleted?.includes(recordType.name!)) {
          toBeDeletedIds.push(recordType.id)
        }
      });
      if (toBeDeletedIds.length > 0) {
        recordTypeRepo.delete(toBeDeletedIds);
      }

      toBeAdded?.forEach(recordTypeName => {
        const recordType = new RecordType();
        recordType.name = recordTypeName;
        // 更新score不需要修改更新时间
        if (recordTypeName !== 'score') {
          recordType.updateTime = new Date().getTime();
        }
        recordType.line = line!;
        recordTypeRepo.save(recordType);
      })
    });
  }
}

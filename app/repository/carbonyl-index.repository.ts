import {IpcMainInvokeEvent} from "electron";
import {AppDataSource} from "../data-source";
import {EventsCenter} from "../events.center";
import {CarbonylIndex} from "../entity/carbonyl-index";
import {Score} from "../entity/score";
import {mainService} from "../main";

export class CarbonylIndexRepository {
  _baseUrl = 'carbonyl-index';
  recordTypeName = 'carbonylIndex'
  constructor(private eventsCenter: EventsCenter) {
    this.loadEvents()
  }
  addEvent(eventKey: string, listener: (event: IpcMainInvokeEvent, ...args: any[]) => (Promise<void>) | (any)): void {
    this.eventsCenter.registerEvent(`${this._baseUrl}-${eventKey}`, listener);
  }

  loadEvents(): void {
    const CarbonylIndexRepo = AppDataSource.getRepository(CarbonylIndex);

    this.addEvent('getAll', async (event: any, lineId: number) => {
      return CarbonylIndexRepo.createQueryBuilder("carbonylIndex")
        .where("lineId = :lineId", {lineId: lineId})
        .orderBy("id", "DESC").getMany();
    });

    this.addEvent('add', async (event: any, carbonylIndex: CarbonylIndex) => {
      carbonylIndex = await CarbonylIndexRepo.save(carbonylIndex);

      const item = await CarbonylIndexRepo.findOne({where: {id: carbonylIndex.id}, relations: ['line']});
      mainService.updateTime({lineId: item?.line?.id, recordTypeName: this.recordTypeName});

      return await CarbonylIndexRepo.find();
    });

    this.addEvent('deleteById', async (event, ciId: number) => {
      const item = await CarbonylIndexRepo.findOne({where: {id: ciId}, relations: ['line']});
      mainService.updateTime({lineId: item?.line?.id, recordTypeName: this.recordTypeName});

      return CarbonylIndexRepo.delete(ciId);
    });

    this.addEvent('update', async (event, carbonylIndex: CarbonylIndex) => {
      const item = await CarbonylIndexRepo.findOne({where: {id: carbonylIndex.id}, relations: ['line']});
      mainService.updateTime({lineId: item?.line?.id, recordTypeName: this.recordTypeName});

      if ((await CarbonylIndexRepo.update(carbonylIndex.id!, carbonylIndex)).affected === 1) {
        return CarbonylIndexRepo.findOne({where: {id: carbonylIndex.id}})
      }
    });

    this.addEvent('getTopOne', async (event: any, lineId: number) => {
      const item = await CarbonylIndexRepo.find({where: {line: {id: lineId}}, order: {id: "DESC"}, take: 1});
      if (item && item.length > 0) {
        return item[0];
      }
      return undefined;
    });
  }
}

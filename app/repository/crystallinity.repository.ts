import {IpcMainInvokeEvent} from "electron";
import {AppDataSource} from "../data-source";
import {EventsCenter} from "../events.center";
import {Crystallinity} from "../entity/crystallinity";
import {Score} from "../entity/score";
import {mainService} from "../main";

export class CrystallinityRepository {
  _baseUrl = 'crystallinity';
  private recordTypeName = 'crystallinity';
  constructor(private eventsCenter: EventsCenter) {
    this.loadEvents()
  }
  addEvent(eventKey: string, listener: (event: IpcMainInvokeEvent, ...args: any[]) => (Promise<void>) | (any)): void {
    this.eventsCenter.registerEvent(`${this._baseUrl}-${eventKey}`, listener);
  }

  loadEvents(): void {
    const CrystallinityRepo = AppDataSource.getRepository(Crystallinity);

    this.addEvent('getAll', async (event: any, lineId: number) => {
      return CrystallinityRepo.createQueryBuilder("crystallinity")
        .where("lineId = :lineId", {lineId: lineId})
        .orderBy("id", "DESC").getMany();
    });

    this.addEvent('add', async (event: any, crystallinity: Crystallinity) => {
      crystallinity = await CrystallinityRepo.save(crystallinity);

      const item = await CrystallinityRepo.findOne({where: {id: crystallinity.id}, relations: ['line']});
      mainService.updateTime({lineId: item?.line?.id, recordTypeName: this.recordTypeName});

      return await CrystallinityRepo.find();
    });

    this.addEvent('deleteById', async (event, id: number) => {
      const item = await CrystallinityRepo.findOne({where: {id: id}, relations: ['line']});
      mainService.updateTime({lineId: item?.line?.id, recordTypeName: this.recordTypeName});

      return CrystallinityRepo.delete(id);
    });

    this.addEvent('update', async (event, crystallinity: Crystallinity) => {
      const item = await CrystallinityRepo.findOne({where: {id: crystallinity.id}, relations: ['line']});
      mainService.updateTime({lineId: item?.line?.id, recordTypeName: this.recordTypeName});

      if ((await CrystallinityRepo.update(crystallinity.id!, crystallinity)).affected === 1) {
        return CrystallinityRepo.findOne({where: {id: crystallinity.id}})
      }
    });

    this.addEvent('getTopOne', async (event: any, lineId: number) => {
      const item = await CrystallinityRepo.find({where: {line: {id: lineId}}, order: {id: "DESC"}, take: 1});
      if (item && item.length > 0) {
        return item[0];
      }
      return undefined;
    });
  }
}

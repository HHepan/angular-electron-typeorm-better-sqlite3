import {IpcMainInvokeEvent} from "electron";
import {AppDataSource} from "../data-source";
import {EventsCenter} from "../events.center";
import {BreakingElongation} from "../entity/breaking-elongation";
import {Score} from "../entity/score";
import {mainService} from "../main";

export class BreakingElongationRepository {
  _baseUrl = 'breaking-elongation';
  recordTypeName = 'breakingElongation';
  constructor(private eventsCenter: EventsCenter) {
    this.loadEvents()
  }
  addEvent(eventKey: string, listener: (event: IpcMainInvokeEvent, ...args: any[]) => (Promise<void>) | (any)): void {
    this.eventsCenter.registerEvent(`${this._baseUrl}-${eventKey}`, listener);
  }

  loadEvents(): void {
    const breakingElongationRepo = AppDataSource.getRepository(BreakingElongation);

    this.addEvent('getAll', async (event: any, lineId: number) => {
      return breakingElongationRepo.createQueryBuilder("breakingElongation")
        .where("lineId = :lineId", {lineId: lineId})
        .orderBy("id", "DESC").getMany();
    });

    this.addEvent('add', async (event: any, breakingElongation: BreakingElongation) => {
      breakingElongation = await breakingElongationRepo.save(breakingElongation);

      const item = await breakingElongationRepo.findOne({where: {id: breakingElongation.id}, relations: ['line']});
      mainService.updateTime({lineId: item?.line?.id, recordTypeName: this.recordTypeName});

      return await breakingElongationRepo.find();
    });

    this.addEvent('deleteById', async (event, itemId: number) => {
      const item = await breakingElongationRepo.findOne({where: {id: itemId}, relations: ['line']});
      mainService.updateTime({lineId: item?.line?.id, recordTypeName: this.recordTypeName});

      return breakingElongationRepo.delete(itemId);
    });

    this.addEvent('update', async (event, breakingElongation: BreakingElongation) => {
      const item = await breakingElongationRepo.findOne({where: {id: breakingElongation.id}, relations: ['line']});
      mainService.updateTime({lineId: item?.line?.id, recordTypeName: this.recordTypeName});

      if ((await breakingElongationRepo.update(breakingElongation.id!, breakingElongation)).affected === 1) {
        return breakingElongationRepo.findOne({where: {id: breakingElongation.id}})
      }
    });

    this.addEvent('getTopOne', async (event: any, lineId: number) => {
      const item = await breakingElongationRepo.find({where: {line: {id: lineId}}, order: {id: "DESC"}, take: 1});
      if (item && item.length > 0) {
        return item[0];
      }
      return undefined;
    });
  }
}

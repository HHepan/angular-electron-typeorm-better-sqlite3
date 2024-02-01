import {IpcMainInvokeEvent} from "electron";
import {AppDataSource} from "../data-source";
import {EventsCenter} from "../events.center";
import {BreakdownFieldStrength} from "../entity/breakdown-field-strength";
import {Conductivity} from "../entity/conductivity";
import {mainService} from "../main";

export class BreakdownFieldStrengthRepository {
  _baseUrl = 'breakdown-field-strength';
  recordTypeName = 'breakdownFieldStrength'
  constructor(private eventsCenter: EventsCenter) {
    this.loadEvents()
  }
  addEvent(eventKey: string, listener: (event: IpcMainInvokeEvent, ...args: any[]) => (Promise<void>) | (any)): void {
    this.eventsCenter.registerEvent(`${this._baseUrl}-${eventKey}`, listener);
  }

  loadEvents(): void {
    const breakdownFieldStrengthRepo = AppDataSource.getRepository(BreakdownFieldStrength);

    this.addEvent('getAll', async (event: any, lineId: number) => {
      return breakdownFieldStrengthRepo.createQueryBuilder("breakdownFieldStrength")
        .where("lineId = :lineId", {lineId: lineId})
        .orderBy("id", "DESC").getMany();
    });

    this.addEvent('add', async (event: any, breakdownFieldStrength: BreakdownFieldStrength) => {
      breakdownFieldStrength = await breakdownFieldStrengthRepo.save(breakdownFieldStrength);

      const item = await breakdownFieldStrengthRepo.findOne({where: {id: breakdownFieldStrength.id}, relations: ['line']});
      mainService.updateTime({lineId: item?.line?.id, recordTypeName: this.recordTypeName});

      return await breakdownFieldStrengthRepo.find();
    });

    this.addEvent('deleteById', async (event: any, _breakdownFieldStrength: BreakdownFieldStrength) => {
      const item = await breakdownFieldStrengthRepo.findOne({where: {id: _breakdownFieldStrength.id}, relations: ['line']});
      mainService.updateTime({lineId: item?.line?.id, recordTypeName: this.recordTypeName});

      const breakdownFieldStrength = await breakdownFieldStrengthRepo.create(_breakdownFieldStrength);
      await breakdownFieldStrengthRepo.remove(breakdownFieldStrength);
      return breakdownFieldStrengthRepo.find();
    });

    this.addEvent('update', async (event: any, breakdownFieldStrengthId: number, newBreakdownFieldStrength: BreakdownFieldStrength) => {
      const item = await breakdownFieldStrengthRepo.findOne({where: {id: breakdownFieldStrengthId}, relations: ['line']});
      mainService.updateTime({lineId: item?.line?.id, recordTypeName: this.recordTypeName});

      if ((await breakdownFieldStrengthRepo.update(breakdownFieldStrengthId, newBreakdownFieldStrength)).affected === 1) {
        return breakdownFieldStrengthRepo.find();
      }
    });

    this.addEvent('getTopOne', async (event: any, lineId: number) => {
      const item = await breakdownFieldStrengthRepo.find({where: {line: {id: lineId}}, order: {id: "DESC"}, take: 1});
      if (item && item.length > 0) {
        return item[0];
      }
      return undefined;
    });
  }
}

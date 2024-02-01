import {IpcMainInvokeEvent} from "electron";
import {AppDataSource} from "../data-source";
import {EventsCenter} from "../events.center";
import {PartialDischarge} from "../entity/partial-discharge";
import {Line} from "../entity/line";
import {mainService} from "../main";

export class PartialDischargeRepository {
  _baseUrl = 'partial-discharge';
  private recordTypeName = 'partialDischarge';
  constructor(private eventsCenter: EventsCenter) {
    this.loadEvents()
  }
  addEvent(eventKey: string, listener: (event: IpcMainInvokeEvent, ...args: any[]) => (Promise<void>) | (any)): void {
    this.eventsCenter.registerEvent(`${this._baseUrl}-${eventKey}`, listener);
  }

  loadEvents(): void {
    const partialDischargeRepo = AppDataSource.getRepository(PartialDischarge);

    this.addEvent('getAll', async (event: any, lineId: number) => {
      return partialDischargeRepo.createQueryBuilder("partialDischarge")
        .where("lineId = :lineId", {lineId: lineId})
        .orderBy("id", "DESC").getMany();
    });

    this.addEvent('add', async (event: any, partialDischarge: PartialDischarge) => {
      partialDischarge = await partialDischargeRepo.save(partialDischarge);

      const item = await partialDischargeRepo.findOne({where: {id: partialDischarge.id}, relations: ['line']});
      mainService.updateTime({lineId: item?.line?.id, recordTypeName: this.recordTypeName});

      return await partialDischargeRepo.find();
    });

    this.addEvent('deleteById', async (event: any, _partialDischarge: PartialDischarge) => {
      const item = await partialDischargeRepo.findOne({where: {id: _partialDischarge.id}, relations: ['line']});
      mainService.updateTime({lineId: item?.line?.id, recordTypeName: this.recordTypeName});

      const partialDischarge = await partialDischargeRepo.create(_partialDischarge);
      await partialDischargeRepo.remove(partialDischarge);
      return partialDischargeRepo.find();
    });

    this.addEvent('update', async (event: any, partialDischargeId: number, newPartialDischarge: PartialDischarge) => {
      const item = await partialDischargeRepo.findOne({where: {id: partialDischargeId}, relations: ['line']});
      mainService.updateTime({lineId: item?.line?.id, recordTypeName: this.recordTypeName});

      if ((await partialDischargeRepo.update(partialDischargeId, newPartialDischarge)).affected === 1) {
        return partialDischargeRepo.find();
      }
    });
  }
}

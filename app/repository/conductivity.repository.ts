import {IpcMainInvokeEvent} from "electron";
import {AppDataSource} from "../data-source";
import {EventsCenter} from "../events.center";
import {Conductivity} from "../entity/conductivity";
import {PartialDischarge} from "../entity/partial-discharge";
import {mainService} from "../main";

export class ConductivityRepository {
    _baseUrl = 'conductivity';
    recordTypeName = 'conductivity';
    constructor(private eventsCenter: EventsCenter) {
        this.loadEvents()
    }
    addEvent(eventKey: string, listener: (event: IpcMainInvokeEvent, ...args: any[]) => (Promise<void>) | (any)): void {
        this.eventsCenter.registerEvent(`${this._baseUrl}-${eventKey}`, listener);
    }

    loadEvents(): void {
      const ConductivityRepo = AppDataSource.getRepository(Conductivity);

      this.addEvent('getAll', async (event: any, lineId: number) => {
        console.log('conductivity', await ConductivityRepo.createQueryBuilder("conductivity")
          .where("lineId = :lineId", {lineId: lineId})
          .orderBy("id", "DESC").getMany());
          return await ConductivityRepo.createQueryBuilder("conductivity")
              .where("lineId = :lineId", {lineId: lineId})
              .orderBy("id", "DESC").getMany();
      });

      this.addEvent('add', async (event: any, conductivity: Conductivity) => {
        conductivity = await ConductivityRepo.save(conductivity);

        const item = await ConductivityRepo.findOne({where: {id: conductivity.id}, relations: ['line']});
        mainService.updateTime({lineId: item?.line?.id, recordTypeName: this.recordTypeName});

        return await ConductivityRepo.find();
      });

      this.addEvent('deleteById', async (event: any, _conductivity: Conductivity) => {
        const item = await ConductivityRepo.findOne({where: {id: _conductivity.id}, relations: ['line']});
        mainService.updateTime({lineId: item?.line?.id, recordTypeName: this.recordTypeName});

        const conductivity = await ConductivityRepo.create(_conductivity);
        await ConductivityRepo.remove(conductivity);
        return ConductivityRepo.find();
      });

      this.addEvent('update', async (event: any, conductivityId: number, newConductivity: Conductivity) => {
        const item = await ConductivityRepo.findOne({where: {id: conductivityId}, relations: ['line']});
        mainService.updateTime({lineId: item?.line?.id, recordTypeName: this.recordTypeName});

        if ((await ConductivityRepo.update(conductivityId, newConductivity)).affected === 1) {
          return ConductivityRepo.find();
        }
      });

      this.addEvent('getTopOne', async (event: any, lineId: number) => {
        const item = await ConductivityRepo.find({where: {line: {id: lineId}}, order: {id: "DESC"}, take: 1});
        if (item && item.length > 0) {
          return item[0];
        }
        return undefined;
      });
    }
}

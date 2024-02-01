import {IpcMainInvokeEvent} from "electron";
import {AppDataSource} from "../data-source";
import {EventsCenter} from "../events.center";
import {LandingSectionTemperature} from "../entity/landing-section-temperature";
import {PartialDischarge} from "../entity/partial-discharge";
import {mainService} from "../main";

export class LandingSectionTemperatureRepository {
  _baseUrl = 'landing-section-temperature';
  private recordTypeName = 'landingSectionTemperature';
  constructor(private eventsCenter: EventsCenter) {
    this.loadEvents()
  }
  addEvent(eventKey: string, listener: (event: IpcMainInvokeEvent, ...args: any[]) => (Promise<void>) | (any)): void {
    this.eventsCenter.registerEvent(`${this._baseUrl}-${eventKey}`, listener);
  }

  loadEvents(): void {
    const landingSectionTemperatureRepo = AppDataSource.getRepository(LandingSectionTemperature);

    this.addEvent('getAll', async (event: any, lineId: number) => {
      return landingSectionTemperatureRepo.createQueryBuilder("LandingSectionTemperature")
        .where("lineId = :lineId", {lineId: lineId})
        .orderBy("id", "DESC").getMany();
    });

    this.addEvent('add', async (event: any, landingSectionTemperature: LandingSectionTemperature) => {
      landingSectionTemperature = await landingSectionTemperatureRepo.save(landingSectionTemperature);

      const item = await landingSectionTemperatureRepo.findOne({where: {id: landingSectionTemperature.id}, relations: ['line']});
      mainService.updateTime({lineId: item?.line?.id, recordTypeName: this.recordTypeName});

      return await landingSectionTemperatureRepo.find();
    });

    this.addEvent('deleteById', async (event: any, _landingSectionTemperature: LandingSectionTemperature) => {
      const item = await landingSectionTemperatureRepo.findOne({where: {id: _landingSectionTemperature.id}, relations: ['line']});
      mainService.updateTime({lineId: item?.line?.id, recordTypeName: this.recordTypeName});

      const landingSectionTemperature = await landingSectionTemperatureRepo.create(_landingSectionTemperature);
      await landingSectionTemperatureRepo.remove(landingSectionTemperature);
      return landingSectionTemperatureRepo.find();
    });

    this.addEvent('update', async (event: any, landingSectionTemperatureId: number, newLandingSectionTemperature: LandingSectionTemperature) => {
      const item = await landingSectionTemperatureRepo.findOne({where: {id: landingSectionTemperatureId}, relations: ['line']});
      mainService.updateTime({lineId: item?.line?.id, recordTypeName: this.recordTypeName});

      if ((await landingSectionTemperatureRepo.update(landingSectionTemperatureId, newLandingSectionTemperature)).affected === 1) {
        return landingSectionTemperatureRepo.find();
      }
    });
  }
}

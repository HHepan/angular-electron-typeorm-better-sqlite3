import {IpcMainInvokeEvent} from "electron";
import {AppDataSource} from "../data-source";
import {EventsCenter} from "../events.center";
import {DielectricParameter} from "../entity/dielectric-parameter";
import {DielectricParameterItem} from "../entity/dielectric-parameter-item";
import {mainService} from "../main";

export class DielectricParameterItemRepository {
    _baseUrl = 'dielectricParameterItem';
    constructor(private eventsCenter: EventsCenter) {
        this.loadEvents()
    }
    addEvent(eventKey: string, listener: (event: IpcMainInvokeEvent, ...args: any[]) => (Promise<void>) | (any)): void {
        this.eventsCenter.registerEvent(`${this._baseUrl}-${eventKey}`, listener);
    }

    loadEvents(): void {
        const DielectricParameterRepo = AppDataSource.getRepository(DielectricParameter);
        const DielectricParameterItemRepo = AppDataSource.getRepository(DielectricParameterItem);

        this.addEvent('deleteById', async (event: any, dielectricParameterItemId: number) => {
          const item = await DielectricParameterRepo.findOne({where: {id: dielectricParameterItemId}, relations: ['line']});
          mainService.updateTime({lineId: item?.line?.id, recordTypeName: 'dielectricParameter'});

          if (await DielectricParameterItemRepo.delete(dielectricParameterItemId)) {
            return true;
          };
          return false;
        });
        this.addEvent('update', async (event: any, dielectricParameterItem: DielectricParameterItem) => {
          const dpi = await DielectricParameterItemRepo.findOne({where: {id: dielectricParameterItem.id}, relations: {dielectricParameter: true}});
          const item = await DielectricParameterRepo.findOne({where: {id: dpi!.dielectricParameter!.id}, relations: ['line']});
          mainService.updateTime({lineId: item?.line?.id, recordTypeName: 'dielectricParameter'});

          return DielectricParameterItemRepo.save(dielectricParameterItem);
        });
    }
}

import {IpcMainInvokeEvent} from "electron";
import {AppDataSource} from "../data-source";
import {EventsCenter} from "../events.center";
import {DielectricParameter} from "../entity/dielectric-parameter";
import {DielectricParameterItem} from "../entity/dielectric-parameter-item";
import {mainService} from "../main";

export class DielectricParameterRepository {
    _baseUrl = 'dielectric-parameter';
    private recordTypeName = 'dielectricParameter';
    constructor(private eventsCenter: EventsCenter) {
        this.loadEvents()
    }
    addEvent(eventKey: string, listener: (event: IpcMainInvokeEvent, ...args: any[]) => (Promise<void>) | (any)): void {
        this.eventsCenter.registerEvent(`${this._baseUrl}-${eventKey}`, listener);
    }

    loadEvents(): void {
        const DielectricParameterRepo = AppDataSource.getRepository(DielectricParameter);
        const DielectricParameterItemRepo = AppDataSource.getRepository(DielectricParameterItem);

        this.addEvent('getAll', async (event: any, lineId: number) => {
            return DielectricParameterRepo.createQueryBuilder("dielectricParameter")
                .where("lineId = :lineId", {lineId: lineId})
                .orderBy("id", "DESC").getMany();
        });

        this.addEvent('add', async (event: any, dielectricParameter: DielectricParameter) => {
          dielectricParameter = await DielectricParameterRepo.save(dielectricParameter);

          const item = await DielectricParameterRepo.findOne({where: {id: dielectricParameter.id}, relations: ['line']});
          mainService.updateTime({lineId: item?.line?.id, recordTypeName: this.recordTypeName});

          return await DielectricParameterRepo.find();
        });

        this.addEvent('getById', async (event: any, dielectricParameterId: number) => {
          return DielectricParameterRepo.findOne({where: {id: dielectricParameterId}});
        });

        this.addEvent('deleteById', async (event: any, dielectricParameterId: number) => {
          const item = await DielectricParameterRepo.findOne({where: {id: dielectricParameterId}, relations: ['line']});
          mainService.updateTime({lineId: item?.line?.id, recordTypeName: this.recordTypeName});

          const DPItems = await DielectricParameterItemRepo.find({where: {dielectricParameter: {id: dielectricParameterId}}});
          await DielectricParameterItemRepo.remove(DPItems);
          const entity = await DielectricParameterRepo.findOne({where: {id: dielectricParameterId}});
          return DielectricParameterRepo.remove(entity!);
        });

        this.addEvent('item-add', async (event: any, dielectricParameterItem: DielectricParameterItem) => {
          const item = await DielectricParameterRepo.findOne({where: {id: dielectricParameterItem.dielectricParameter?.id}, relations: ['line']});
          mainService.updateTime({lineId: item?.line?.id, recordTypeName: this.recordTypeName});

          await DielectricParameterItemRepo.save(dielectricParameterItem);
          return await DielectricParameterItemRepo.find();
        });

        this.addEvent('item-getAll', async (event: any, dielectricParameterId: number) => {

          return DielectricParameterItemRepo.createQueryBuilder("dielectricParameterItem")
              .where("dielectricParameterId = :dielectricParameterId", {dielectricParameterId: dielectricParameterId})
              .orderBy("id", "DESC").getMany();
        });

        this.addEvent('getTopOne', async (event: any, lineId: number) => {
          const item = await DielectricParameterRepo.find({where: {line: {id: lineId}}, order: {id: "DESC"}, take: 1, relations: {dielectricParameterItems: true}});
          if (item && item.length > 0) {
            return item[0];
          }
          return undefined;
        });
        this.addEvent('updateDate', async (event: any, DPId: number, date: number) => {
          const item = await DielectricParameterRepo.findOne({where: {id: DPId}});
          if (item) {
            item.createTime = date;
            return DielectricParameterRepo.save(item);
          }
          return undefined;
        });
    }
}

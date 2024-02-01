import {EventsCenter} from "../events.center";
import {IpcMainInvokeEvent, ipcRenderer} from "electron";
import {AppDataSource} from "../data-source";
import {Score} from "../entity/score";
import {Line} from "../entity/line";
import {System} from "../entity/system";
import {mainService} from "../main";

export class ScoreRepository {
  _baseUrl = 'score';
  recordTypeName =  'score';

  constructor(private eventsCenter: EventsCenter) {
    this.loadEvents();
  }

  addEvent(eventKey: string, listener: (event: IpcMainInvokeEvent, ...args: any[]) => (Promise<void>) | (any)): void {
    this.eventsCenter.registerEvent(`${this._baseUrl}-${eventKey}`, listener);
  }

  loadEvents(): void {
    const scoreRepo = AppDataSource.getRepository(Score);
    const lineRepo = AppDataSource.getRepository(Line);
    const systemRepo = AppDataSource.getRepository(System);
    this.addEvent('add', async (event, lineId: number, score: Score) => {
      const line = await lineRepo.findOne({where: {id: lineId}});
      score.line = line!;
      mainService.updateTime({lineId, recordTypeName: this.recordTypeName});

      return scoreRepo.save(score);
    });

    this.addEvent('deleteById', async (event, scoreId: number) => {
      const score = await scoreRepo.findOne({where: {id: scoreId}, relations: ['line']});
      mainService.updateTime({lineId: score?.line?.id, recordTypeName: this.recordTypeName});

      return scoreRepo.delete(scoreId);
    });

    this.addEvent('getAllByLineId', async (event, lineId: number) => {
      return scoreRepo.find({
        where: {
          line: {
            id: lineId
          }
        },
        order: {
          id: "DESC"
        }
      });
    });

    this.addEvent('getScoresByLineId', async (event, lineId, num: number) => {
      return scoreRepo.find({
        relations: {
          line: true
        },
        where: {
          line: {
            id: lineId
          }
        },
        order: {
          id: "DESC"
        },
        take: num
      });
    });

    this.addEvent('update', async (event, score: Score) => {
      const item = await scoreRepo.findOne({where: {id: score.id}, relations: ['line']});
      mainService.updateTime({lineId: item?.line?.id, recordTypeName: this.recordTypeName});

      const s = await scoreRepo.findOne({where: {id: score?.id}, relations: ['line']});
      mainService.updateTime({lineId: score?.line?.id, recordTypeName: this.recordTypeName});
      if ((await scoreRepo.update(score.id, score)).affected === 1) {
        return scoreRepo.findOne({where: {id: score.id}})
      }
    });

    this.addEvent('getIsDangerOfLine', async (event, lineId: number) => {
      const score = await scoreRepo.findOne({where: {line: {id: lineId}}, order: {createTime: "DESC"}});
      const warningValue = await systemRepo.findOne({where: {key: 'warningValue'}});
      if (warningValue?.value && score && (score.value !== undefined) && score.value < +warningValue.value) {
        return true;
      }
      return false;
    });
  }

}

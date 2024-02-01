import {Injectable} from "@angular/core";
import {Score} from "../../app/entity/score";
import {fromPromise} from "rxjs/internal/observable/innerFrom";
import {Observable} from "rxjs";
import {Assert} from "@yunzhi/utils";
import {APP_CONFIG} from "../environments/environment";
import {ElectronService} from "./electron.service";

@Injectable({
  providedIn: 'root'
})
export class ScoreService {
  private baseUrl = 'score' + '-';
  constructor(private electronService: ElectronService) {
  }

  add(data: { createTime: number; lineId: number | undefined; value: number | null | undefined }): Observable<Score> {
    Assert.isNotNullOrUndefined(data.lineId, data.value, data.createTime, 'value error');
    const score = new Score();
    score.value = data.value!;
    score.createTime = data.createTime;
    return fromPromise<Score>(this.electronService.ipcRenderer
      .invoke(this.baseUrl + 'add', data.lineId, score));
  }

  getScoresByLineId(lineId: number | undefined, num: number) {
    Assert.isNotNullOrUndefined(lineId, 'id type error');
    return fromPromise<Score[]>(this.electronService.ipcRenderer
      .invoke(this.baseUrl + 'getScoresByLineId', lineId, num));
  }

  getAllByLineId(lineId: number) {
    Assert.isNotNullOrUndefined(lineId, 'id type error');
    return fromPromise<Score[]>(this.electronService.ipcRenderer
      .invoke(this.baseUrl + 'getAllByLineId', lineId));
  }

  deleteById(scoreId: number): Observable<any> {
    Assert.isNotNullOrUndefined(scoreId, 'id type error');
    return fromPromise(this.electronService.ipcRenderer
      .invoke(this.baseUrl + 'deleteById', scoreId));
  }

  update(score: { id: number; createTime: number; value: number | null | undefined }) {
    Assert.isNotNullOrUndefined(score.id, score.value, score.createTime, 'value error');
    return fromPromise<Score>(this.electronService.ipcRenderer
      .invoke(this.baseUrl + 'update', score));
  }

  getIsDangerOfLine(lineId: number): Observable<boolean> {
    Assert.isNotNullOrUndefined(lineId, 'value error');
    return fromPromise<boolean>(this.electronService.ipcRenderer
    .invoke(this.baseUrl + 'getIsDangerOfLine', lineId));
  }
}

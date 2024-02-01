import { Injectable } from '@angular/core';
import {Observable, from, throwError} from "rxjs";
import {catchError} from "rxjs/operators";
import {BreakingElongation} from "../../app/entity/breaking-elongation";
import {ElectronService} from "./electron.service";
import {Assert} from "@yunzhi/utils";
import {fromPromise} from "rxjs/internal/observable/innerFrom";
import {Score} from "../../app/entity/score";
import {defaultPoint} from "../app/key";

@Injectable({
  providedIn: 'root'
})
export class BreakingElongationService {
  private baseUrl = 'breaking-elongation' + '-';
  constructor(private _electronService: ElectronService) {}

  getBreakingElongationsByLineId(lineId: number | undefined): Observable<BreakingElongation[]> {
    return from(this._electronService.ipcRenderer.invoke(this.baseUrl + 'getAll', lineId))
      .pipe(catchError((error: any) => throwError(error.json)));
  }

  addBreakingElongation(breakingElongation: BreakingElongation): Observable<BreakingElongation[]> {
    return from(this._electronService.ipcRenderer.invoke(this.baseUrl + 'add', breakingElongation))
      .pipe(catchError((error: any) => throwError(error.json)));
  }

  deleteById(id: number | undefined) {
    Assert.isNotNullOrUndefined(id, 'id type error');
    return fromPromise(this._electronService.ipcRenderer
      .invoke(this.baseUrl + 'deleteById', id));
  }

  update(score: { id: number; createTime: number; value: string | null | undefined, position: string }) {
    Assert.isNotNullOrUndefined(score.id, score.value, score.createTime, 'value error');
    console.log('update', score);
    return fromPromise<BreakingElongation>(this._electronService.ipcRenderer
      .invoke(this.baseUrl + 'update', score));
  }

  getTopOne(lineId: number) {
    return this._electronService.ipcRenderer.invoke(this.baseUrl + 'getTopOne', lineId);
  }

  getPoint(breakingElongation: BreakingElongation) {
    return breakingElongation?.value ?  50 * (breakingElongation.value - 500) / 100 : defaultPoint;
  }
}

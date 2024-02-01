import { Injectable } from '@angular/core';
import {ElectronService} from "./electron.service";
import {Observable, from, throwError} from "rxjs";
import {catchError} from "rxjs/operators";
import {Crystallinity} from "../../app/entity/crystallinity";
import {Assert} from "@yunzhi/utils";
import {fromPromise} from "rxjs/internal/observable/innerFrom";
import {Score} from "../../app/entity/score";
import {BreakdownFieldStrength} from "../../app/entity/breakdown-field-strength";
import {defaultPoint} from "../app/key";



@Injectable({
  providedIn: 'root'
})
export class CrystallinityService {
  private baseUrl = 'crystallinity' + '-';
  constructor(private _electronService: ElectronService) {}

  getCrystallinitiesByLineId(lineId: number | undefined): Observable<Crystallinity[]> {
    return from(this._electronService.ipcRenderer.invoke('crystallinity-getAll', lineId))
      .pipe(catchError((error: any) => throwError(error.json)));
  }

  addCrystallinity(cartialDischarge: Crystallinity): Observable<Crystallinity[]> {
    return from(this._electronService.ipcRenderer.invoke('crystallinity-add', cartialDischarge))
      .pipe(catchError((error: any) => throwError(error.json)));
  }

  deleteById(id: number | undefined) {
    Assert.isNotNullOrUndefined(id, 'id type error');
    return fromPromise(this._electronService.ipcRenderer
      .invoke(this.baseUrl + 'deleteById', id));
  }

  update(score: { id: number; createTime: number; value: string | null | undefined, position: string }) {
    Assert.isNotNullOrUndefined(score.id, score.value, score.createTime, 'value error');
    return fromPromise<Crystallinity>(this._electronService.ipcRenderer
      .invoke(this.baseUrl + 'update', score));
  }

  getTopOne(lineId: number) {
    return this._electronService.ipcRenderer.invoke('crystallinity-getTopOne', lineId);
  }

  getPoint(crystallinity: Crystallinity, breakdownFieldStrength?: BreakdownFieldStrength) {
    let bestParam = 32;
    if (breakdownFieldStrength && breakdownFieldStrength.value && breakdownFieldStrength.value <= 22) {
      bestParam = 12;
    }
    return crystallinity?.value ? 500 * (crystallinity.value - bestParam) / 100 : defaultPoint;
  }
}

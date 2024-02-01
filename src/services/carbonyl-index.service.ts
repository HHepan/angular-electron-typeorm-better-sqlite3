import { Injectable } from '@angular/core';
import {ElectronService} from "./electron.service";
import {Observable, from, throwError} from "rxjs";
import {catchError} from "rxjs/operators";
import {CarbonylIndex} from "../../app/entity/carbonyl-index";
import {Assert} from "@yunzhi/utils";
import {fromPromise} from "rxjs/internal/observable/innerFrom";
import {BreakdownFieldStrength} from "../../app/entity/breakdown-field-strength";
import {defaultPoint} from "../app/key";



@Injectable({
  providedIn: 'root'
})
export class CarbonylIndexService {
  private baseUrl = 'carbonyl-index' + '-';
  constructor(private _electronService: ElectronService) {}

  getCarbonylIndexsByLineId(lineId: number | undefined): Observable<CarbonylIndex[]> {
    return from(this._electronService.ipcRenderer.invoke('carbonyl-index-getAll', lineId))
      .pipe(catchError((error: any) => throwError(error.json)));
  }

  addCarbonylIndex(carbonylIndex: CarbonylIndex): Observable<CarbonylIndex[]> {
    return from(this._electronService.ipcRenderer.invoke('carbonyl-index-add', carbonylIndex))
      .pipe(catchError((error: any) => throwError(error.json)));
  }
  deleteById(id: number | undefined) {
    Assert.isNotNullOrUndefined(id, 'id type error');
    return fromPromise(this._electronService.ipcRenderer
      .invoke(this.baseUrl + 'deleteById', id));
  }

  update(carbonylIndex: { createTime: number; id: number; position: string; value: string | null | undefined }) {
    Assert.isNotNullOrUndefined(carbonylIndex.id, carbonylIndex.value, carbonylIndex.createTime, 'value error');
    return fromPromise<CarbonylIndex>(this._electronService.ipcRenderer
      .invoke(this.baseUrl + 'update', carbonylIndex));
  }

  getTopOne(lineId: number) {
    return this._electronService.ipcRenderer.invoke('carbonyl-index-getTopOne', lineId);
  }

  getPoint(carbonylIndex: CarbonylIndex, breakdownFieldStrength?: BreakdownFieldStrength) {
    let bestParam = 0.75;
    if (breakdownFieldStrength && breakdownFieldStrength.value && breakdownFieldStrength.value <= 22) {
      bestParam = 1.75;
    }
    return carbonylIndex?.value ? 100 - 100 * (carbonylIndex.value - bestParam) : defaultPoint;
  }
}

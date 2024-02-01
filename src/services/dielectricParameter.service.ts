import { Injectable } from '@angular/core';
import {ElectronService} from "./electron.service";
import {Observable, from, throwError} from "rxjs";
import {catchError} from "rxjs/operators";
import {DielectricParameter} from "../../app/entity/dielectric-parameter";
import {Line} from "../../app/entity/line";
import {DielectricParameterItem} from "../../app/entity/dielectric-parameter-item";
import {Assert, isNotNullOrUndefined} from "@yunzhi/utils";
import {BreakdownFieldStrength} from "../../app/entity/breakdown-field-strength";
import {defaultPoint} from "../app/key";


@Injectable({
  providedIn: 'root'
})
export class DielectricParameterService {
    constructor(private _electronService: ElectronService) {}

    getDielectricParametersByLineId(lineId: number | undefined): Observable<DielectricParameter[]> {
        return from(this._electronService.ipcRenderer.invoke('dielectric-parameter-getAll', lineId))
            .pipe(catchError((error: any) => throwError(error.json)));
    }

    addDielectricParameter(dielectricParameter: DielectricParameter): Observable<DielectricParameter[]> {
        return from(this._electronService.ipcRenderer.invoke('dielectric-parameter-add', dielectricParameter))
            .pipe(catchError((error: any) => throwError(error.json)));
    }

    getById(dielectricParameterId: number | undefined): Observable<DielectricParameter> {
        return from(this._electronService.ipcRenderer.invoke('dielectric-parameter-getById', dielectricParameterId))
            .pipe(catchError((error: any) => throwError(error.json)));
    }

    addDielectricParameterItem(dielectricParameterItem: DielectricParameterItem): Observable<DielectricParameterItem[]> {
        return from(this._electronService.ipcRenderer.invoke('dielectric-parameter-item-add', dielectricParameterItem))
            .pipe(catchError((error: any) => throwError(error.json)));
    }

    getDielectricParameterItemsByDielectricParameterId(dielectricParameterId: number | undefined): Observable<DielectricParameterItem[]> {
        return from(this._electronService.ipcRenderer.invoke('dielectric-parameter-item-getAll', dielectricParameterId))
            .pipe(catchError((error: any) => throwError(error.json)));
    }

  deleteById(id: number) {
    Assert.isNotNullOrUndefined(id, 'id value error');
    return from(this._electronService.ipcRenderer.invoke('dielectric-parameter-deleteById', id))
      .pipe(catchError((error: any) => throwError(error.json)));
  }

  getTopOne(lineId: number) {
    return this._electronService.ipcRenderer.invoke('dielectric-parameter-getTopOne', lineId);
  }

  getPoint(dielectricParameter: DielectricParameter, breakdownFieldStrength?: BreakdownFieldStrength) {
    let bestParam = 0.002;
    if (breakdownFieldStrength && breakdownFieldStrength.value && breakdownFieldStrength.value <= 22) {
      bestParam = 0.007;
    }
    let value = undefined;
    dielectricParameter?.dielectricParameterItems?.forEach(item => {
      if (item.frequency && item.frequency - 0.1 < 0.001) {
        value = item.value;
      }
    })
    return value ? 100 - 20000 * (value - bestParam) : defaultPoint;
  }

  updateDate(dateTime: number, DPId: number) {
      return this._electronService.ipcRenderer.invoke('dielectric-parameter-updateDate', DPId, dateTime)
  }
}

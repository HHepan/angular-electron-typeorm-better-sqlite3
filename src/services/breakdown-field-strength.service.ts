import { Injectable } from '@angular/core';
import {Observable, from, throwError} from "rxjs";
import {catchError} from "rxjs/operators";
import {BreakdownFieldStrength} from "../../app/entity/breakdown-field-strength";
import {ElectronService} from "./electron.service";
import {fromPromise} from "rxjs/internal/observable/innerFrom";
import {defaultPoint} from "../app/key";



@Injectable({
  providedIn: 'root'
})
export class BreakdownFieldStrengthService {
  constructor(private _electronService: ElectronService) {
  }

  getBreakdownFieldStrengthsByLineId(lineId: number | undefined): Observable<BreakdownFieldStrength[]> {
    return from(this._electronService.ipcRenderer.invoke('breakdown-field-strength-getAll', lineId))
      .pipe(catchError((error: any) => throwError(error.json)));
  }

  addBreakdownFieldStrength(breakdownFieldStrength: BreakdownFieldStrength): Observable<BreakdownFieldStrength[]> {
    return from(this._electronService.ipcRenderer.invoke('breakdown-field-strength-add', breakdownFieldStrength))
      .pipe(catchError((error: any) => throwError(error.json)));
  }

  deleteById(breakdownFieldStrength: BreakdownFieldStrength): Observable<any> {
    return fromPromise(this._electronService.ipcRenderer
      .invoke('breakdown-field-strength-deleteById', breakdownFieldStrength));
  }

  updateConductivity(breakdownFieldStrengthId: number | undefined, newBreakdownFieldStrength: BreakdownFieldStrength): Observable<any> {
    return from(this._electronService.ipcRenderer.invoke('breakdown-field-strength-update', breakdownFieldStrengthId, newBreakdownFieldStrength))
      .pipe(catchError((error: any) => throwError(error.json)));
  }

  getTopOne(lineId: number) {
    return this._electronService.ipcRenderer.invoke('breakdown-field-strength-getTopOne', lineId);
  }

  getPoint(breakdownFieldStrength: BreakdownFieldStrength) {
    return breakdownFieldStrength?.value ? (100 / 9) * (breakdownFieldStrength.value - 22) : defaultPoint;
  }
}

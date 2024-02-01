import { Injectable } from '@angular/core';
import {Observable, from, throwError} from "rxjs";
import {PartialDischarge} from "../../app/entity/partial-discharge";
import {catchError} from "rxjs/operators";
import {ElectronService} from "./electron.service";
import {Assert} from "@yunzhi/utils";
import {fromPromise} from "rxjs/internal/observable/innerFrom";
import {Line} from "../../app/entity/line";



@Injectable()
export class PartialDischargeService {
  constructor(private _electronService: ElectronService) {}

  getPartialDischargesByLineId(lineId: number | undefined): Observable<PartialDischarge[]> {
    return from(this._electronService.ipcRenderer.invoke('partial-discharge-getAll', lineId))
      .pipe(catchError((error: any) => throwError(error.json)));
  }

  addPartialDischarge(partialDischarge: PartialDischarge): Observable<PartialDischarge[]> {
    return from(this._electronService.ipcRenderer.invoke('partial-discharge-add', partialDischarge))
      .pipe(catchError((error: any) => throwError(error.json)));
  }

  deleteById(partialDischarge: PartialDischarge): Observable<any> {
    return fromPromise(this._electronService.ipcRenderer
      .invoke('partial-discharge-deleteById', partialDischarge));
  }

  updatePartialDischarge(partialDischargeId: number | undefined, newPartialDischarge: PartialDischarge): Observable<PartialDischarge[]>  {
    return from(this._electronService.ipcRenderer.invoke('partial-discharge-update', partialDischargeId, newPartialDischarge))
      .pipe(catchError((error: any) => throwError(error.json)));
  }
}

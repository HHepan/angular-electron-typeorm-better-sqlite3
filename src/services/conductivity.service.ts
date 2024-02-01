import { Injectable } from '@angular/core';
import {ElectronService} from "./electron.service";
import {Observable, from, throwError} from "rxjs";
import {catchError} from "rxjs/operators";
import {Conductivity} from "../../app/entity/conductivity";
import {fromPromise} from "rxjs/internal/observable/innerFrom";
import {defaultPoint} from "../app/key";


@Injectable({
  providedIn: 'root'
})
export class ConductivityService {
    constructor(private _electronService: ElectronService) {}

    getConductivitiesByLineId(lineId: number | undefined): Observable<Conductivity[]> {
        return from(this._electronService.ipcRenderer.invoke('conductivity-getAll', lineId))
            .pipe(catchError((error: any) => throwError(error.json)));
    }

    addConductivity(conductivity: Conductivity): Observable<Conductivity[]> {
        return from(this._electronService.ipcRenderer.invoke('conductivity-add', conductivity))
            .pipe(catchError((error: any) => throwError(error.json)));
    }

  deleteById(conductivity: Conductivity): Observable<any> {
    return fromPromise(this._electronService.ipcRenderer
      .invoke('conductivity-deleteById', conductivity));
  }

  updateConductivity(conductivityId: number | undefined, newConductivity: Conductivity): Observable<Conductivity[]> {
    return from(this._electronService.ipcRenderer.invoke('conductivity-update', conductivityId, newConductivity))
      .pipe(catchError((error: any) => throwError(error.json)));
  }

  getTopOne(lineId: number) {
    return this._electronService.ipcRenderer.invoke('conductivity-getTopOne', lineId);
  }

  getPoint(conductivity: Conductivity) {
    const value = conductivity?.value1 && conductivity?.value2 ? conductivity.value1 * Math.pow(10, conductivity.value2) : defaultPoint;
    return 100 - (12.5 * Math.pow(10, 15) * (value - 2 * Math.pow(10, -15)));
  }
}

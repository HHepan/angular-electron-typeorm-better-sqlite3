import { Injectable } from '@angular/core';
import {ElectronService} from "./electron.service";
import {Observable, from, throwError} from "rxjs";
import {PartialDischarge} from "../../app/entity/partial-discharge";
import {catchError} from "rxjs/operators";
import {LandingSectionTemperature} from "../../app/entity/landing-section-temperature";
import {fromPromise} from "rxjs/internal/observable/innerFrom";



@Injectable()
export class LandingSectionTemperatureService {
  constructor(private _electronService: ElectronService) {}

  getLandingSectionTemperaturesByLineId(lineId: number | undefined): Observable<PartialDischarge[]> {
    return from(this._electronService.ipcRenderer.invoke('landing-section-temperature-getAll', lineId))
      .pipe(catchError((error: any) => throwError(error.json)));
  }

  addLandingSectionTemperature(landingSectionTemperature: LandingSectionTemperature): Observable<PartialDischarge[]> {
    return from(this._electronService.ipcRenderer.invoke('landing-section-temperature-add', landingSectionTemperature))
      .pipe(catchError((error: any) => throwError(error.json)));
  }

  deleteById(LandingSectionTemperature: LandingSectionTemperature) {
    return fromPromise(this._electronService.ipcRenderer
      .invoke('landing-section-temperature-deleteById', LandingSectionTemperature));
  }

  updateLandingSectionTemperature(landingSectionTemperatureId: number | undefined, newLandingSectionTemperature: LandingSectionTemperature): Observable<LandingSectionTemperature[]> {
    return from(this._electronService.ipcRenderer.invoke('landing-section-temperature-update', landingSectionTemperatureId, newLandingSectionTemperature))
      .pipe(catchError((error: any) => throwError(error.json)));
  }
}

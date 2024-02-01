import { Injectable } from '@angular/core';
import { Observable, throwError, from } from 'rxjs';
import { catchError } from 'rxjs/operators';
import {Line} from "../../app/entity/line";
import {ElectronService} from "./electron.service";
import {Assert} from "@yunzhi/utils";



@Injectable()
export class LineService {
  constructor(private _electronService: ElectronService) {}

  getLines(searchName: string | null): Observable<Line[]> {
    return from(this._electronService.ipcRenderer.invoke('line-getAll', searchName))
      .pipe(catchError((error: any) => throwError(error.json)));
  }

  addLine(line: Line): Observable<Line[]> {
    return from(this._electronService.ipcRenderer.invoke('line-add', line))
      .pipe(catchError((error: any) => throwError(error.json)));
  }

  updateLine(lineId: number | undefined, newLine: Line): Observable<Line[]> {
    return from(this._electronService.ipcRenderer.invoke('line-update', lineId, newLine))
      .pipe(catchError((error: any) => throwError(error.json)));
  }

  updateLineTypes(lineId: number | undefined, newTypes: string | undefined): Observable<Line[]> {
    return from(this._electronService.ipcRenderer.invoke('line-update-types', lineId, newTypes))
      .pipe(catchError((error: any) => throwError(error.json)));
  }

  deleteLine(line: Line): Observable<any> {
    return from(this._electronService.ipcRenderer.invoke('line-deleteById', line))
      .pipe(catchError((error: any) => throwError(error.json)));
  }

  getById(lineId: number | undefined): Observable<Line> {
    return from(this._electronService.ipcRenderer.invoke('line-getById', lineId))
      .pipe(catchError((error: any) => throwError(error.json)));
  }

  updateLineRecordTypes(lineId: number | undefined, recordTypes: string[]) {
    Assert.isNotNullOrUndefined(lineId, 'value error');
    return from(this._electronService.ipcRenderer.invoke('line-updateLineRecordTypes', lineId, recordTypes))
      .pipe(catchError((error: any) => throwError(error.json)));
  }
}

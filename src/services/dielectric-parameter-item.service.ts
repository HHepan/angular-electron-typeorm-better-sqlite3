import { Injectable } from '@angular/core';
import {ElectronService} from "./electron.service";
import {DielectricParameterItem} from "../../app/entity/dielectric-parameter-item";
import {fromPromise} from "rxjs/internal/observable/innerFrom";
import {Assert} from "@yunzhi/utils";


@Injectable({
  providedIn: 'root'
})
export class DielectricParameterItemService {
  private readonly baseUrl = 'dielectricParameterItem' + '-'
  constructor(private _electronService: ElectronService) {
  }

  deleteById(dielectricParameterItemId: number) {
    Assert.isNotNullOrUndefined(dielectricParameterItemId, 'value error');
    return fromPromise<DielectricParameterItem>(this._electronService.ipcRenderer
      .invoke(this.baseUrl + 'deleteById', dielectricParameterItemId));
  }

  update(dielectricParameterItem: DielectricParameterItem) {
    return fromPromise<DielectricParameterItem>(this._electronService.ipcRenderer
      .invoke(this.baseUrl + 'update', dielectricParameterItem));
  }
}

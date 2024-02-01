import {Injectable} from "@angular/core";
import {ElectronService} from "./electron.service";
import {Line} from "../../app/entity/line";
import {from, Observable, throwError} from "rxjs";
import {catchError} from "rxjs/operators";
import {Item} from "../../app/entity/item";

@Injectable()
export class IndexService {
  constructor(private _electronService: ElectronService) {
  }

  addItem(item: Item): Observable<Electron.Item> {
    return from(this._electronService.ipcRenderer.invoke('item-add', item))
      .pipe(catchError((error: any) => throwError(error.json)));
  }
}

import {Injectable} from "@angular/core";
import {fromPromise} from "rxjs/internal/observable/innerFrom";
import {Observable} from "rxjs";
import {ElectronService} from "./electron.service";
import {System} from "../../app/entity/system";

@Injectable({
  providedIn: 'root'
})
export class SystemService {
  private baseUrl = 'system' + '-';
  constructor(private electronService: ElectronService) {
  }

  getSystemItem(key: string): Observable<System> {
    return fromPromise<System>(this.electronService.ipcRenderer
      .invoke(this.baseUrl + 'getSystemItem', key));
  }

  setSystemItem(key: string, value: string): Observable<void> {
    return fromPromise<void>(this.electronService.ipcRenderer
      .invoke(this.baseUrl + 'setSystemItem', key, value));
  }
}

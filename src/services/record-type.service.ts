import {Injectable} from "@angular/core";
import {ElectronService} from "./electron.service";

@Injectable({
  providedIn: 'root'
})
export class RecordTypeService {
  private baseUrl = 'recordType' + '-';
  constructor(private electronService: ElectronService) {
  }
}

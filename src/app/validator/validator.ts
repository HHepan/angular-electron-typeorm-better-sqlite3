import {Injectable} from '@angular/core';
import {AbstractControl, ValidationErrors} from "@angular/forms";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class Validator {
  limitNumber(max: number): (control: AbstractControl) => Observable<ValidationErrors | null> {
    return (control) => {
      return new Observable<ValidationErrors | null>(subscriber => {
        const result = control.value > max;
        result ? subscriber.next({result: result}) : subscriber.next(null);
        subscriber.complete();
      });
    };
  }
}

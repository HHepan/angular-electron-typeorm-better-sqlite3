import {Component, EventEmitter, Output} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Line} from "../../../../app/entity/line";
import {Location} from "../../../../app/entity/location";
import {LineService} from "../../../services/line.service";
import {CommonService} from "../../../services/common.service";

@Component({
  selector: 'app-line-add',
  templateUrl: './line-add.component.html',
  styleUrls: ['./line-add.component.css']
})
export class LineAddComponent {
  @Output() isSubmit = new EventEmitter<boolean>();
  formGroup: FormGroup;
  formGroupKey = {
    name: 'name',
    voltage: 'voltage',
    length: 'length',
    longitude1: 'longitude1',
    latitude1: 'latitude1',
    longitude2: 'longitude2',
    latitude2: 'latitude2',
    createTime: 'createTime'
  };
  constructor(private commonService: CommonService,
              private lineService: LineService) {
    this.formGroup = new FormGroup({
      // eslint-disable-next-line @typescript-eslint/unbound-method
      name: new FormControl('', [Validators.required]),
      // eslint-disable-next-line @typescript-eslint/unbound-method
      voltage: new FormControl('', [Validators.required]),
      // eslint-disable-next-line @typescript-eslint/unbound-method
      longitude1: new FormControl('', [Validators.required]),
      // eslint-disable-next-line @typescript-eslint/unbound-method
      latitude1: new FormControl('', [Validators.required]),
      // eslint-disable-next-line @typescript-eslint/unbound-method
      longitude2: new FormControl('', [Validators.required]),
      // eslint-disable-next-line @typescript-eslint/unbound-method
      latitude2: new FormControl('', [Validators.required]),
      // eslint-disable-next-line @typescript-eslint/unbound-method
      length: new FormControl('', [Validators.required]),
      // eslint-disable-next-line @typescript-eslint/unbound-method
      createTime: new FormControl('', [Validators.required])
    });
  }

  onSubmit(formGroup: FormGroup) {
    const line = new Line();
    const location1 = new Location();
    const location2 = new Location();
    location1.longitude = formGroup.get(this.formGroupKey.longitude1)?.value;
    location1.latitude = formGroup.get(this.formGroupKey.latitude1)?.value;
    location2.longitude = formGroup.get(this.formGroupKey.longitude1)?.value;
    location2.latitude = formGroup.get(this.formGroupKey.latitude1)?.value;
    line.name = formGroup.get(this.formGroupKey.name)?.value;
    line.voltage = formGroup.get(this.formGroupKey.voltage)?.value;
    line.length = formGroup.get(this.formGroupKey.length)?.value;
    line.types = 'score';
    line.location1 = location1;
    line.location2 = location2;
    // console.log('createDate', formGroup.get(this.formGroupKey.createTime)?.value);
    const createDate = formGroup.get(this.formGroupKey.createTime)?.value;
    const createTime = new Date(createDate as string).getTime();
    // console.log('createTime', createTime);
    line.createTime = createTime;
    this.lineService.addLine(line).subscribe(() => {
      this.commonService.success(() => {
        this.isSubmit.emit(true);
        this.formGroupSetNull();
      });
    });
  }

  formGroupSetNull(): void {
    this.formGroup.get(this.formGroupKey.name)?.setValue(null);
    this.formGroup.get(this.formGroupKey.voltage)?.setValue(null);
    this.formGroup.get(this.formGroupKey.length)?.setValue(null);
  }
}

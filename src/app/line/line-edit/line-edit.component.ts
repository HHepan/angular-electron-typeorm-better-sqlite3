import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {LineService} from "../../../services/line.service";
import {Line} from "../../../../app/entity/line";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {CommonService} from "../../../services/common.service";
import {Location} from "../../../../app/entity/location";
import {DatePipe} from "@angular/common";

@Component({
  selector: 'app-line-edit',
  templateUrl: './line-edit.component.html',
  styleUrls: ['./line-edit.component.css']
})
export class LineEditComponent implements OnInit{
  @Output() isSubmit = new EventEmitter<boolean>();
  @Input() lineId: number | undefined;
  line: Line;
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

  constructor(private lineService: LineService,
              private commonService: CommonService,
              private datePipe: DatePipe) {
    this.formGroup = new FormGroup({
      // eslint-disable-next-line @typescript-eslint/unbound-method
      name: new FormControl('', [Validators.required]),
      // eslint-disable-next-line @typescript-eslint/unbound-method
      longitude1: new FormControl('', [Validators.required]),
      // eslint-disable-next-line @typescript-eslint/unbound-method
      latitude1: new FormControl('', [Validators.required]),
      // eslint-disable-next-line @typescript-eslint/unbound-method
      longitude2: new FormControl('', [Validators.required]),
      // eslint-disable-next-line @typescript-eslint/unbound-method
      latitude2: new FormControl('', [Validators.required]),
      // eslint-disable-next-line @typescript-eslint/unbound-method
      voltage: new FormControl('', [Validators.required]),
      // eslint-disable-next-line @typescript-eslint/unbound-method
      length: new FormControl('', [Validators.required]),
      // eslint-disable-next-line @typescript-eslint/unbound-method
      createTime: new FormControl('', [Validators.required]),
    });
    this.line = new Line();
  }

  ngOnInit(): void {
    console.log('lineId', this.lineId);
    this.lineService.getById(this.lineId).subscribe(line => {
      console.log('line', line);
      this.line = line;
      this.setData(line);
    });
  }

  onSubmit(formGroup: FormGroup): void {
    const location1 = new Location();
    const location2 = new Location();
    location1.id = this.line?.location1?.id;
    location1.longitude = formGroup.get(this.formGroupKey.longitude1)?.value;
    location1.latitude = formGroup.get(this.formGroupKey.latitude1)?.value;
    location2.id = this.line?.location2?.id;
    location2.longitude = formGroup.get(this.formGroupKey.longitude2)?.value;
    location2.latitude = formGroup.get(this.formGroupKey.latitude2)?.value;
    const newLine = new Line();
    newLine.name = formGroup.get(this.formGroupKey.name)?.value;
    newLine.voltage = formGroup.get(this.formGroupKey.voltage)?.value;
    newLine.length = formGroup.get(this.formGroupKey.length)?.value;
    console.log('createDate', formGroup.get(this.formGroupKey.createTime)?.value);
    const createDate = formGroup.get(this.formGroupKey.createTime)?.value;
    const createTime = new Date(createDate as string).getTime();
    console.log('createTime', createTime);
    newLine.createTime = createTime;
    newLine.location1 = location1;
    newLine.location2 = location2;
    console.log('newLine', newLine);
    this.lineService.updateLine(this.lineId, newLine).subscribe(() => {
      console.log('编辑成功');
      this.commonService.success(() => {
        this.isSubmit.emit(true);
      });
    });
  }

  private setData(line: Line): void {
    this.formGroup.get(this.formGroupKey.name)?.setValue(line.name);
    this.formGroup.get(this.formGroupKey.voltage)?.setValue(line.voltage);
    this.formGroup.get(this.formGroupKey.length)?.setValue(line.length);
    const createTime = line.createTime;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    this.formGroup.get(this.formGroupKey.createTime)?.setValue(this.datePipe.transform(createTime, 'yyyy-MM'));
    this.formGroup.get(this.formGroupKey.longitude1)?.setValue(line.location1?.longitude);
    this.formGroup.get(this.formGroupKey.latitude1)?.setValue(line.location1?.latitude);
    this.formGroup.get(this.formGroupKey.longitude2)?.setValue(line.location2?.longitude);
    this.formGroup.get(this.formGroupKey.latitude2)?.setValue(line.location2?.latitude);
  }
}

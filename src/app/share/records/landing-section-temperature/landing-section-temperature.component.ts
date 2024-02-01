import {AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {LineService} from "../../../../services/line.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Line} from "../../../../../app/entity/line";
import {LandingSectionTemperature} from "../../../../../app/entity/landing-section-temperature";
import {LandingSectionTemperatureService} from "../../../../services/landing-section-temperature.service";
import {CommonService} from "../../../../services/common.service";
import {EChartsOption} from "echarts";
import {DatePipe} from "@angular/common";
import {APP_CONFIG} from "../../../../environments/environment";

@Component({
  selector: 'app-landing-section-temperature',
  templateUrl: './landing-section-temperature.component.html',
  styleUrls: ['./landing-section-temperature.component.css']
})
export class LandingSectionTemperatureComponent implements OnInit, AfterViewInit {
  @Input() lineId: number | undefined;
  @Input() set updateTime(time: number | null) {
    console.log('updateTime', time);
    this.lastUpdateTime = time;
  }
  lastUpdateTime: number | null = null;
  @Input()
  set isOpen(isOpen: boolean) {
    this._isOpen = isOpen;
    this.commonService.clickButtonDom(this.accordionButton, isOpen);
  }
  _isOpen = false;
  @ViewChild('accordionButton') accordionButton: ElementRef<HTMLButtonElement> | undefined;
  isShowModal = false;
  isShowModalForMore = false;
  isShowModalForEdit = false;
  formGroup: FormGroup;
  editFormGroup: FormGroup;
  line: Line | undefined;
  formGroupKey = {
    createTime: 'createTime',
    value: 'value',
  };
  landingSectionTemperatures = [] as LandingSectionTemperature[];
  echartsOption: EChartsOption = {} as EChartsOption;
  currentLandingSectionTemperatureId: number | undefined;
  displayItemNumber = APP_CONFIG.displayItemNumber;

  constructor(private lineService: LineService,
              private landingSectionTemperatureService: LandingSectionTemperatureService,
              private commonService: CommonService,
              private datePipe: DatePipe) {
    this.formGroup = new FormGroup({
      // eslint-disable-next-line @typescript-eslint/unbound-method
      createTime: new FormControl('', [Validators.required]),
      // eslint-disable-next-line @typescript-eslint/unbound-method
      value: new FormControl('', [Validators.required])
    });
    this.editFormGroup = new FormGroup({
      // eslint-disable-next-line @typescript-eslint/unbound-method
      createTime: new FormControl('', [Validators.required]),
      // eslint-disable-next-line @typescript-eslint/unbound-method
      value: new FormControl('', [Validators.required])
    });
  }
  ngOnInit(): void {
    this.landingSectionTemperatureService.getLandingSectionTemperaturesByLineId(this.lineId).subscribe(landingSectionTemperatures => {
      this.landingSectionTemperatures = landingSectionTemperatures;
      this.updateChartData(landingSectionTemperatures);
    });
  }
  ngAfterViewInit(): void {
    this.commonService.clickButtonDom(this.accordionButton, this._isOpen);
  }

  onModalOpen() {
    this.isShowModal = true;
  }

  onModalClose() {
    this.isShowModal = false;
  }

  onModalForMoreOpen() {
    this.isShowModalForMore = true;
  }
  onModalForMoreClose() {
    this.isShowModalForMore = false;
  }

  onModalForEditOpen(landingSectionTemperature: LandingSectionTemperature) {
    this.isShowModalForEdit = true;
    this.currentLandingSectionTemperatureId = landingSectionTemperature.id;
    this.setEditFormGroup(landingSectionTemperature);
  }
  onModalForEditClose() {
    this.isShowModalForEdit = false;
  }

  setEditFormGroup(landingSectionTemperature: LandingSectionTemperature) {
    const createDate = this.datePipe.transform(landingSectionTemperature.createTime, 'yyyy-MM-dd');
    this.editFormGroup.get(this.formGroupKey.createTime)?.setValue(createDate);
    this.editFormGroup.get(this.formGroupKey.value)?.setValue(landingSectionTemperature.value);
  }

  onSubmit(formGroup: FormGroup) {
    this.lastUpdateTime = new Date().getTime();
    this.lineService.getById(this.lineId).subscribe(line => {
      this.line = line;
      const landingSectionTemperature = new LandingSectionTemperature();
      const createDate = formGroup.get(this.formGroupKey.createTime)?.value;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      const createTime = new Date(createDate).getTime();
      landingSectionTemperature.createTime = createTime;
      landingSectionTemperature.value = formGroup.get(this.formGroupKey.value)?.value;
      landingSectionTemperature.line = line;
      this.landingSectionTemperatureService.addLandingSectionTemperature(landingSectionTemperature).subscribe(() => {
        this.commonService.success(() => {
          this.ngOnInit();
          this.formGroupSetNull();
        });
      });
    });
    this.onModalClose();
  }

  formGroupSetNull(): void {
    this.formGroup.get(this.formGroupKey.createTime)?.setValue(null);
    this.formGroup.get(this.formGroupKey.value)?.setValue(null);
  }

  private updateChartData(landingSectionTemperatures: LandingSectionTemperature[]) {
    const xData: string[] = [];
    const yData: string[] = [];
    const copyLandingSectionTemperatures = [] as LandingSectionTemperature[];
    landingSectionTemperatures.forEach(landingSectionTemperature => {
      copyLandingSectionTemperatures.push(landingSectionTemperature);
    });
    copyLandingSectionTemperatures.sort((a, b) => a.createTime! - b.createTime!);
    copyLandingSectionTemperatures.forEach(landingSectionTemperature => {
      xData.push(this.datePipe.transform(landingSectionTemperature.createTime, 'yyyy-MM-dd') + '');
      yData.push(landingSectionTemperature.value ? landingSectionTemperature.value.toString() : '');
    });
    this.echartsOption = {
      xAxis: {
        name: '时间',
        data: xData,
      },
      yAxis: {
        name: '温度(℃)',
      },
      series: [{
        data: yData
      }]
    };
  }

  onDelete(LandingSectionTemperature: LandingSectionTemperature) {
    this.commonService.confirm(confirm => {
      if (confirm) {
        this.landingSectionTemperatureService.deleteById(LandingSectionTemperature)
          .subscribe(() => {
            this.commonService.success(() => {
              this.lastUpdateTime = new Date().getTime();
              this.ngOnInit();
            });
          });
      }
    }, '请确认');
  }

  onEditSubmit(editFormGroup: FormGroup) {
    this.lastUpdateTime = new Date().getTime();
    const newLandingSectionTemperature = new LandingSectionTemperature();
    const createDate = editFormGroup.get(this.formGroupKey.createTime)?.value;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const createTime = new Date(createDate).getTime();
    newLandingSectionTemperature.createTime = createTime;
    newLandingSectionTemperature.value = editFormGroup.get(this.formGroupKey.value)?.value;
    this.landingSectionTemperatureService.updateLandingSectionTemperature(this.currentLandingSectionTemperatureId, newLandingSectionTemperature)
      .subscribe(() => {
        this.commonService.success(() => {
          this.ngOnInit();
          this.onModalForEditClose();
        });
      });
  }

  protected readonly APP_CONFIG = APP_CONFIG;
}

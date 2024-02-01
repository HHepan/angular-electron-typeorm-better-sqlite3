import {AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Line} from "../../../../../app/entity/line";
import {LineService} from "../../../../services/line.service";
import {CommonService} from "../../../../services/common.service";
import {BreakdownFieldStrengthService} from "../../../../services/breakdown-field-strength.service";
import {BreakdownFieldStrength} from "../../../../../app/entity/breakdown-field-strength";
import {EChartsOption} from "echarts";
import {DatePipe} from "@angular/common";
import {Conductivity} from "../../../../../app/entity/conductivity";
import {APP_CONFIG} from "../../../../environments/environment";

@Component({
  selector: 'app-breakdown-field-strength',
  templateUrl: './breakdown-field-strength.component.html',
  styleUrls: ['./breakdown-field-strength.component.css']
})
export class BreakdownFieldStrengthComponent implements OnInit, AfterViewInit {
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
    positionLine: 'positionLine',
    position: 'position'
  };
  breakdownFieldStrengths = [] as BreakdownFieldStrength[];
  echartsOption: EChartsOption = {} as EChartsOption;
  currentBreakdownFieldStrengthId: number | undefined;
  displayItemNumber = APP_CONFIG.displayItemNumber;


  ngAfterViewInit(): void {
    this.commonService.clickButtonDom(this.accordionButton, this._isOpen);
  }
  constructor(private lineService: LineService,
              private commonService: CommonService,
              private breakdownFieldStrengthService: BreakdownFieldStrengthService,
              private datePipe: DatePipe) {
    this.formGroup = new FormGroup({
      // eslint-disable-next-line @typescript-eslint/unbound-method
      createTime: new FormControl('', [Validators.required]),
      // eslint-disable-next-line @typescript-eslint/unbound-method
      value: new FormControl('', [Validators.required]),
      // eslint-disable-next-line @typescript-eslint/unbound-method
      positionLine: new FormControl('', [Validators.required]),
      // eslint-disable-next-line @typescript-eslint/unbound-method
      position: new FormControl('', [Validators.required])
    });
    this.editFormGroup = new FormGroup({
      // eslint-disable-next-line @typescript-eslint/unbound-method
      createTime: new FormControl('', [Validators.required]),
      // eslint-disable-next-line @typescript-eslint/unbound-method
      value: new FormControl('', [Validators.required]),
      // eslint-disable-next-line @typescript-eslint/unbound-method
      positionLine: new FormControl('', [Validators.required]),
      // eslint-disable-next-line @typescript-eslint/unbound-method
      position: new FormControl('', [Validators.required])
    });
  }
  ngOnInit(): void {
    this.breakdownFieldStrengthService.getBreakdownFieldStrengthsByLineId(this.lineId).subscribe(breakdownFieldStrengths => {
      this.breakdownFieldStrengths = breakdownFieldStrengths;
      this.updateChartData(breakdownFieldStrengths);
    });
    this.lineService.getById(this.lineId).subscribe(line => {
      this.line = line;
      this.formGroup.get(this.formGroupKey.positionLine)?.setValue(line.name);
    });
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

  onModalForEditOpen(breakdownFieldStrength: BreakdownFieldStrength) {
    this.isShowModalForEdit = true;
    this.currentBreakdownFieldStrengthId = breakdownFieldStrength.id;
    this.setEditFormGroup(breakdownFieldStrength);
  }
  onModalForEditClose() {
    this.isShowModalForEdit = false;
  }

  onSubmit(formGroup: FormGroup) {
    this.lastUpdateTime = new Date().getTime();
    const breakdownFieldStrength = new BreakdownFieldStrength();
    const createDate = formGroup.get(this.formGroupKey.createTime)?.value;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const createTime = new Date(createDate).getTime();
    breakdownFieldStrength.createTime = createTime;
    breakdownFieldStrength.value = formGroup.get(this.formGroupKey.value)?.value;
    breakdownFieldStrength.line = this.line;
    // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
    const position = formGroup.get(this.formGroupKey.positionLine)?.value + '线路' + formGroup.get(this.formGroupKey.position)?.value + '米处';
    breakdownFieldStrength.position = position;
    this.breakdownFieldStrengthService.addBreakdownFieldStrength(breakdownFieldStrength).subscribe(() => {
      this.commonService.success(() => {
        this.ngOnInit();
        this.formGroupSetNull();
      });
    });
    this.onModalClose();
  }

  formGroupSetNull(): void {
    this.formGroup.get(this.formGroupKey.createTime)?.setValue(null);
    this.formGroup.get(this.formGroupKey.value)?.setValue(null);
    this.formGroup.get(this.formGroupKey.positionLine)?.setValue(null);
    this.formGroup.get(this.formGroupKey.position)?.setValue(null);
  }

  setEditFormGroup(breakdownFieldStrength: BreakdownFieldStrength) {
    const createDate = this.datePipe.transform(breakdownFieldStrength.createTime, 'yyyy-MM-dd');
    this.editFormGroup.get(this.formGroupKey.createTime)?.setValue(createDate);
    this.editFormGroup.get(this.formGroupKey.value)?.setValue(breakdownFieldStrength.value);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const positionLineAndPosition = this.commonService.extractPositionLineAndPosition(breakdownFieldStrength.position);
    this.editFormGroup.get(this.formGroupKey.positionLine)?.setValue(positionLineAndPosition[0]);
    this.editFormGroup.get(this.formGroupKey.position)?.setValue(positionLineAndPosition[1]);
  }

  private updateChartData(breakdownFieldStrengths: BreakdownFieldStrength[]) {
    const xData: string[] = [];
    const yData: string[] = [];
    const copyBreakdownFieldStrengths = [] as BreakdownFieldStrength[];
    breakdownFieldStrengths.forEach(breakdownFieldStrength => {
      copyBreakdownFieldStrengths.push(breakdownFieldStrength);
    });
    copyBreakdownFieldStrengths.sort((a, b) => a.createTime! - b.createTime!);
    copyBreakdownFieldStrengths.forEach(breakdownFieldStrength => {
      xData.push(this.datePipe.transform(breakdownFieldStrength.createTime, 'yyyy-MM-dd') + '');
      yData.push(breakdownFieldStrength.value ? breakdownFieldStrength.value.toString() : '');
    });
    this.echartsOption = {
      grid: {
        left: '9%',  // 设置左边距，调整图表在容器中的位置
      },
      xAxis: {
        name: '时间',
        data: xData,
      },
      yAxis: {
        name: "      击穿场强(kV/mm)",
      },
      series: [{
        data: yData
      }]
    };
  }

  onDelete(breakdownFieldStrength: BreakdownFieldStrength) {
    this.commonService.confirm(confirm => {
      if (confirm) {
        this.breakdownFieldStrengthService.deleteById(breakdownFieldStrength)
          .subscribe(() => {
            this.commonService.success(() => {
              console.log('删除数据成功');
              this.lastUpdateTime = new Date().getTime();
              this.ngOnInit();
            });
          });
      }
    }, '请确认');
  }

  onEditSubmit(editFormGroup: FormGroup) {
    this.lastUpdateTime = new Date().getTime();
    console.log('onEditSubmit currentPartialDischargeId', this.currentBreakdownFieldStrengthId);
    console.log('onEditSubmit editFormGroup', editFormGroup.value);
    const newBreakdownFieldStrength = new BreakdownFieldStrength();
    const createDate = editFormGroup.get(this.formGroupKey.createTime)?.value;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const createTime = new Date(createDate).getTime();
    newBreakdownFieldStrength.createTime = createTime;
    newBreakdownFieldStrength.value = editFormGroup.get(this.formGroupKey.value)?.value;
    // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
    const position = editFormGroup.get(this.formGroupKey.positionLine)?.value + '线路' + editFormGroup.get(this.formGroupKey.position)?.value + '米处';
    newBreakdownFieldStrength.position = position;
    this.breakdownFieldStrengthService.updateConductivity(this.currentBreakdownFieldStrengthId, newBreakdownFieldStrength)
      .subscribe(() => {
        this.onModalForEditClose();
        this.commonService.success(() => {
          console.log('编辑数据成功');
          this.ngOnInit();
        });
      });
  }

  protected readonly APP_CONFIG = APP_CONFIG;
}

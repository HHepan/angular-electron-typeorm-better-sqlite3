import {AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {LineService} from "../../../../services/line.service";
import {Line} from "../../../../../app/entity/line";
import {PartialDischarge} from "../../../../../app/entity/partial-discharge";
import {PartialDischargeService} from "../../../../services/partial-discharge.service";
import {CommonService} from "../../../../services/common.service";
import {EChartsOption} from "echarts";
import {DatePipe} from "@angular/common";
import {APP_CONFIG} from "../../../../environments/environment";
@Component({
  selector: 'app-partial-discharge',
  templateUrl: './partial-discharge.component.html',
  styleUrls: ['./partial-discharge.component.css']
})
export class PartialDischargeComponent implements OnInit, AfterViewInit {
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
  currentPartialDischargeId: number | undefined;
  formGroup: FormGroup;
  editFormGroup: FormGroup;
  line: Line | undefined;
  formGroupKey = {
    createTime: 'createTime',
    value: 'value',
    positionLine: 'positionLine',
    position: 'position'
  };
  partialDischarges = [] as PartialDischarge[];
  echartsOption: EChartsOption = {} as EChartsOption;
  displayItemNumber = APP_CONFIG.displayItemNumber;

  constructor(private lineService: LineService,
              private partialDischargeService: PartialDischargeService,
              private commonService: CommonService,
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
    this.partialDischargeService.getPartialDischargesByLineId(this.lineId).subscribe(partialDischarges => {
      this.partialDischarges = partialDischarges;
      this.updateChartData(partialDischarges);
    });
    this.lineService.getById(this.lineId).subscribe(line => {
      this.line = line;
      this.formGroup.get(this.formGroupKey.positionLine)?.setValue(line.name);
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

  onModalForEditOpen(partialDischarge: PartialDischarge) {
    this.isShowModalForEdit = true;
    this.currentPartialDischargeId = partialDischarge.id;
    this.setEditFormGroup(partialDischarge);
  }
  onModalForEditClose() {
    this.isShowModalForEdit = false;
  }
  onSubmit(formGroup: FormGroup) {
    this.lastUpdateTime = new Date().getTime();
    const partialDischarge = new PartialDischarge();
    const createDate = formGroup.get(this.formGroupKey.createTime)?.value;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const createTime = new Date(createDate).getTime();
    partialDischarge.createTime = createTime;
    partialDischarge.value = formGroup.get(this.formGroupKey.value)?.value;
    // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
    const position = formGroup.get(this.formGroupKey.positionLine)?.value + '线路' + formGroup.get(this.formGroupKey.position)?.value + '米处';
    partialDischarge.position = position;
    partialDischarge.line = this.line;
    console.log('partialDischarge', partialDischarge);
    this.partialDischargeService.addPartialDischarge(partialDischarge).subscribe(() => {
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

  setEditFormGroup(partialDischarge: PartialDischarge) {
    const createDate = this.datePipe.transform(partialDischarge.createTime, 'yyyy-MM-dd');
    this.editFormGroup.get(this.formGroupKey.createTime)?.setValue(createDate);
    this.editFormGroup.get(this.formGroupKey.value)?.setValue(partialDischarge.value);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const positionLineAndPosition = this.commonService.extractPositionLineAndPosition(partialDischarge.position);
    this.editFormGroup.get(this.formGroupKey.positionLine)?.setValue(positionLineAndPosition[0]);
    this.editFormGroup.get(this.formGroupKey.position)?.setValue(positionLineAndPosition[1]);
  }


  private updateChartData(partialDischarges: PartialDischarge[]) {
    const xData: string[] = [];
    const yData: string[] = [];
    const copyPartialDischarges = [] as PartialDischarge[];
    partialDischarges.forEach(partialDischarge => {
      copyPartialDischarges.push(partialDischarge);
    });
    copyPartialDischarges.sort((a, b) => a.createTime! - b.createTime!);
    copyPartialDischarges.forEach(partialDischarge => {
      xData.push(this.datePipe.transform(partialDischarge.createTime, 'yyyy-MM-dd') + '');
      yData.push(partialDischarge.value ? partialDischarge.value.toString() : '');
    });
    this.echartsOption = {
      xAxis: {
        name: '时间',
        data: xData,
      },
      yAxis: {
        name: '放电量(pC)'
      },
      series: [{
        data: yData
      }]
    };
  }

  onDelete(partialDischarge: PartialDischarge) {
    this.commonService.confirm(confirm => {
      if (confirm) {
        this.partialDischargeService.deleteById(partialDischarge)
          .subscribe(() => {
            this.lastUpdateTime = new Date().getTime();
            this.commonService.success(() => {
              console.log('删除数据成功');
              this.ngOnInit();
            });
          });
      }
    }, '请确认');
  }

  onEditSubmit(editFormGroup: FormGroup) {
    this.lastUpdateTime = new Date().getTime();
    const newPartialDischarge = new PartialDischarge();
    const createDate = editFormGroup.get(this.formGroupKey.createTime)?.value;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const createTime = new Date(createDate).getTime();
    newPartialDischarge.createTime = createTime;
    newPartialDischarge.value = editFormGroup.get(this.formGroupKey.value)?.value;
    // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
    const position = editFormGroup.get(this.formGroupKey.positionLine)?.value + '线路' + editFormGroup.get(this.formGroupKey.position)?.value + '米处';
    newPartialDischarge.position = position;
    this.partialDischargeService.updatePartialDischarge(this.currentPartialDischargeId, newPartialDischarge)
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

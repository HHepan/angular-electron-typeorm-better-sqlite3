import {AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Line} from "../../../../../app/entity/line";
import {LineService} from "../../../../services/line.service";
import {CommonService} from "../../../../services/common.service";
import {CarbonylIndexService} from "../../../../services/carbonyl-index.service";
import {ConductivityService} from "../../../../services/conductivity.service";
import {Conductivity} from "../../../../../app/entity/conductivity";
import {Score} from "../../../../../app/entity/score";
import {EChartsOption, number} from "echarts";
import {DatePipe} from "@angular/common";
import {PartialDischarge} from "../../../../../app/entity/partial-discharge";
import {APP_CONFIG} from "../../../../environments/environment";

@Component({
  selector: 'app-conductivity',
  templateUrl: './conductivity.component.html',
  styleUrls: ['./conductivity.component.css']
})
export class ConductivityComponent implements OnInit, AfterViewInit {
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
  currentConductivityId: number | undefined;
  isShowModal = false;
  isShowModalForMore = false;
  isShowModalForEdit = false;
  formGroup: FormGroup;
  editFormGroup: FormGroup;
  line: Line | undefined;
  formGroupKey = {
    createTime: 'createTime',
    value1: 'value1',
    value2: 'value2',
    positionLine: 'positionLine',
    position: 'position'
  };
  conductivites = [] as Conductivity[];
  echartsOption: EChartsOption = {} as EChartsOption;
  displayItemNumber = APP_CONFIG.displayItemNumber;

  constructor(private lineService: LineService,
              private commonService: CommonService,
              private conductivityService: ConductivityService,
              private datePipe: DatePipe) {
    this.formGroup = new FormGroup({
        // eslint-disable-next-line @typescript-eslint/unbound-method
        createTime: new FormControl('', [Validators.required]),
        // eslint-disable-next-line @typescript-eslint/unbound-method
        value1: new FormControl('', [Validators.required]),
        // eslint-disable-next-line @typescript-eslint/unbound-method
        value2: new FormControl('', [Validators.required]),
        // eslint-disable-next-line @typescript-eslint/unbound-method
        positionLine: new FormControl('', [Validators.required]),
        // eslint-disable-next-line @typescript-eslint/unbound-method
        position: new FormControl('', [Validators.required])
    });
    this.editFormGroup = new FormGroup({
      // eslint-disable-next-line @typescript-eslint/unbound-method
      createTime: new FormControl('', [Validators.required]),
      // eslint-disable-next-line @typescript-eslint/unbound-method
      value1: new FormControl('', [Validators.required]),
      // eslint-disable-next-line @typescript-eslint/unbound-method
      value2: new FormControl('', [Validators.required]),
      // eslint-disable-next-line @typescript-eslint/unbound-method
      positionLine: new FormControl('', [Validators.required]),
      // eslint-disable-next-line @typescript-eslint/unbound-method
      position: new FormControl('', [Validators.required])
    });
  }

  ngOnInit(): void {
    this.conductivityService.getConductivitiesByLineId(this.lineId).subscribe(conductivites => {
      this.conductivites = conductivites;
      this.updateChartData(conductivites);
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

  onModalForEditOpen(conductivity: Conductivity) {
    this.isShowModalForEdit = true;
    this.currentConductivityId = conductivity.id;
    this.setEditFormGroup(conductivity);
  }
  onModalForEditClose() {
    this.isShowModalForEdit = false;
  }

  onSubmit(formGroup: FormGroup) {
    this.lastUpdateTime = new Date().getTime();
    const conductivity = new Conductivity();
    const createDate = formGroup.get(this.formGroupKey.createTime)?.value;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const createTime = new Date(createDate).getTime();
    conductivity.createTime = createTime;
    conductivity.value1 = formGroup.get(this.formGroupKey.value1)?.value;
    conductivity.value2 = formGroup.get(this.formGroupKey.value2)?.value;
    conductivity.line = this.line;
    // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
    const position = formGroup.get(this.formGroupKey.positionLine)?.value + '线路' + formGroup.get(this.formGroupKey.position)?.value + '米处';
    conductivity.position = position;
    this.conductivityService.addConductivity(conductivity).subscribe(() => {
        this.commonService.success(() => {
            this.ngOnInit();
            this.formGroupSetNull();
        });
    });
    this.onModalClose();
  }

  onEditSubmit(editFormGroup: FormGroup) {
    this.lastUpdateTime = new Date().getTime();
    const newConductivity = new Conductivity();
    newConductivity.createTime = editFormGroup.get(this.formGroupKey.createTime)?.value;
    newConductivity.value1 = editFormGroup.get(this.formGroupKey.value1)?.value;
    newConductivity.value2 = editFormGroup.get(this.formGroupKey.value2)?.value;
    // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
    const position = editFormGroup.get(this.formGroupKey.positionLine)?.value + '线路' + editFormGroup.get(this.formGroupKey.position)?.value + '米处';
    newConductivity.position = position;
    this.conductivityService.updateConductivity(this.currentConductivityId, newConductivity)
      .subscribe(() => {
        this.onModalForEditClose();
        this.commonService.success(() => {
          this.ngOnInit();
        });
      });
  }

  formGroupSetNull(): void {
      this.formGroup.get(this.formGroupKey.createTime)?.setValue(null);
      this.formGroup.get(this.formGroupKey.value1)?.setValue(null);
      this.formGroup.get(this.formGroupKey.value2)?.setValue(null);
      this.formGroup.get(this.formGroupKey.positionLine)?.setValue(null);
      this.formGroup.get(this.formGroupKey.position)?.setValue(null);
  }

  setEditFormGroup(conductivity: Conductivity) {
    const createDate = this.datePipe.transform(conductivity.createTime, 'yyyy-MM-dd');
    const createTime = new Date(createDate as string).getTime();
    this.editFormGroup.get(this.formGroupKey.createTime)?.setValue(createTime);
    this.editFormGroup.get(this.formGroupKey.value1)?.setValue(conductivity.value1);
    this.editFormGroup.get(this.formGroupKey.value2)?.setValue(conductivity.value2);
    console.log('setEditFormGroup position', conductivity.position);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const positionLineAndPosition = this.commonService.extractPositionLineAndPosition(conductivity.position);
    console.log('setEditFormGroup positionLineAndPosition', positionLineAndPosition);
    this.editFormGroup.get(this.formGroupKey.positionLine)?.setValue(positionLineAndPosition[0]);
    this.editFormGroup.get(this.formGroupKey.position)?.setValue(positionLineAndPosition[1]);
  }

  private updateChartData(conductivites: Conductivity[]) {
    const xData: string[] = [];
    const yData: string[] = [];
    const copyConductivites = [] as Conductivity[];
    conductivites.forEach(conductivity => {
      copyConductivites.push(conductivity);
    });
    copyConductivites.sort((a, b) => a.createTime! - b.createTime!);
    console.log('copyConductivites after sort', copyConductivites);
    let max: number | undefined;
    copyConductivites.forEach(conductivity => {
      xData.push(this.datePipe.transform(conductivity.createTime, 'yyyy-MM-dd') + '');
      const forYData = this.calculateYDate(conductivity.value1, conductivity.value2);
      if (max == undefined || (forYData && forYData > max)) {
        max = forYData;
      }
      yData.push(forYData ? forYData.toString() : '');
    });
    this.echartsOption = {
      grid: {
        left: '14%',  // 设置左边距，调整图表在容器中的位置
      },
      tooltip: {
        axisPointer: {
          label: {
            formatter: (param) => {
              const valueString = param.value.toString();
              if (valueString.includes('e')) {
                const strings = valueString.split('e');
                let before = strings[0];
                const after = strings[1];
                const numberValue: number = parseFloat(before);
                before =  Number(numberValue.toFixed(2)).toString();
                return before + 'e' + after;
              }
              return valueString;
            }
          }
        }
      },
      xAxis: {
        name: '时间',
        data: xData,
      },
      yAxis: {
        max: max,
        name: '电导率(S/m)',
        axisLabel: {
          formatter: function (value: number) {
            // const key = Number(Math.exp(value).toExponential());
            // // 将科学记数法的数值转换为字符串，并提取底数部分
            // const basePart = key.toExponential().split('e')[0];
            // // 使用 parseFloat 将底数部分解析为浮点数，然后使用 toFixed 保留两位小数
            // const formattedBase = parseFloat(basePart).toFixed(2);
            // // 提取指数部分
            // const exponentPart = key.toExponential().split('e')[1];
            // return `${formattedBase}e${exponentPart}`;
            return value.toExponential();
          },
        }
      },
      series: [{
        data: yData,
      }]
    };
  }

  onDelete(conductivity: Conductivity) {
    this.commonService.confirm(confirm => {
      if (confirm) {
        this.conductivityService.deleteById(conductivity)
          .subscribe(() => {
            this.commonService.success(() => {
              this.lastUpdateTime = new Date().getTime();
              this.ngOnInit();
            });
          });
      }
    }, '请确认');
  }

  private calculateYDate(value1: number | undefined, value2: number | undefined) {
    if (value1 !== undefined && value2 !== undefined) {
      return value1 * Math.pow(10, value2);
      // return Math.log(value1 * Math.pow(10, value2));
    }
  }

  protected readonly APP_CONFIG = APP_CONFIG;
}

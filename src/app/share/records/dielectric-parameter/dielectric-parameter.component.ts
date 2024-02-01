import {AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {AbstractControl, FormControl, FormGroup, Validators} from "@angular/forms";
import {Line} from "../../../../../app/entity/line";
import {LineService} from "../../../../services/line.service";
import {CommonService} from "../../../../services/common.service";
import {DielectricParameter} from "../../../../../app/entity/dielectric-parameter";
import {DielectricParameterService} from "../../../../services/dielectricParameter.service";
import {DielectricParameterItem} from "../../../../../app/entity/dielectric-parameter-item";
import {DielectricParameterItemService} from "../../../../services/dielectric-parameter-item.service";
import {EChartsOption} from "echarts";
import {APP_CONFIG} from "../../../../environments/environment";
import {DatePipe} from "@angular/common";

@Component({
  selector: 'app-dielectric-parameter',
  templateUrl: './dielectric-parameter.component.html',
  styleUrls: ['./dielectric-parameter.component.css']
})
export class DielectricParameterComponent implements OnInit, AfterViewInit {
  @Input() lineId: number | undefined;
  @Input() set updateTime(time: number | null) {
    console.log('updateTime', time);
    this.lastUpdateTime = time;
  }
  isEditingDate = false;
  lastUpdateTime: number | null = null;
  @Input()
  set isOpen(isOpen: boolean) {
    this._isOpen = isOpen;
    this.commonService.clickButtonDom(this.accordionButton, isOpen);
  }
  _isOpen = false;
  @ViewChild('accordionButton') accordionButton: ElementRef<HTMLButtonElement> | undefined;
  isShowModal = false;
  formGroup: FormGroup;
  formGroupForAdd: FormGroup;
  line: Line | undefined;
  formGroupKey = {
    createTime: 'createTime',
    frequency: 'frequency',
    value: 'value',
    V: 'V'
  };
  dielectricParameters = [] as DielectricParameter[];
  dielectricParameterItems = [] as DielectricParameterItem[];
  latestDielectricParameterItems = [] as DielectricParameterItem[];
  isShowModalForDate = false;
  isShowModalForAdd = false;
  currentDielectricParameterId: number | undefined;
  isShowItemEditModal = false;
  echartsOption = {} as EChartsOption;
  private editedDPItem: DielectricParameterItem = {} as DielectricParameterItem;
  currentDielectricParameter: DielectricParameter | undefined;
  currentEditDielectricParameterItem: DielectricParameterItem | undefined;
  // eslint-disable-next-line @typescript-eslint/unbound-method
  dateControl = new FormControl<string>('', [Validators.required]);
  constructor(private lineService: LineService,
              private commonService: CommonService,
              private dielectricParameterService: DielectricParameterService,
              private datePipe: DatePipe,
              private dielectricParameterItemService: DielectricParameterItemService) {
    this.formGroup = new FormGroup({
      // eslint-disable-next-line @typescript-eslint/unbound-method
      createTime: new FormControl('', [Validators.required]),
    });

    this.formGroupForAdd = new FormGroup({
      // eslint-disable-next-line @typescript-eslint/unbound-method
      frequency: new FormControl('', [Validators.required]),
      // eslint-disable-next-line @typescript-eslint/unbound-method
      value: new FormControl('', [Validators.required]),
      V: new FormControl('', [Validators.required]),
    });
  }

  ngAfterViewInit(): void {
    this.commonService.clickButtonDom(this.accordionButton, this._isOpen);
  }
  initDielectricParameterItems() {
    this.dielectricParameterService.getDielectricParameterItemsByDielectricParameterId(this.currentDielectricParameterId)
        .subscribe(dielectricParameterItems => {
          dielectricParameterItems.sort((a, b) => a.frequency! - b.frequency!);
          this.dielectricParameterItems = dielectricParameterItems;
          // console.log('dielectricParameterItems', dielectricParameterItems);
        });
  }
  setLatestDielectricParameterItems(dielectricParameterId: number) {
    this.dielectricParameterService.getDielectricParameterItemsByDielectricParameterId(dielectricParameterId)
        .subscribe(dielectricParameterItems => {
          this.latestDielectricParameterItems = dielectricParameterItems;
          this.updateChartData(this.latestDielectricParameterItems);
        });
  }

  ngOnInit(): void {
    this.dielectricParameterService.getDielectricParametersByLineId(this.lineId).subscribe(dielectricParameters => {
      this.dielectricParameters = dielectricParameters;
      if (this.dielectricParameters.length > 0) {
        this.setLatestDielectricParameterItems(this.dielectricParameters[0].id!);
      } else {
        this.updateChartData([])
      }
    });
  }

  onModalOpen() {
    this.isShowModal = true;
  }

  onModalClose() {
    this.isShowModal = false;
  }

  onModalOpenForAdd() {
    this.isShowModalForAdd = true;
  }

  onModalCloseForAdd() {
    this.isShowModalForAdd = false;
  }

  onModalOpenForDate(id: number | undefined) {
    this.isShowModalForDate = true;
    this.currentDielectricParameterId = id;
    this.currentDielectricParameter = this.dielectricParameters.find(dp => dp.id === this.currentDielectricParameterId);
    this.dielectricParameterService.getById(this.currentDielectricParameterId)
      .subscribe(currentDielectricParameter => {
        this.currentDielectricParameter = currentDielectricParameter;
      });
    this.initDielectricParameterItems();
  }

  onModalCloseForDate() {
    this.isShowModalForDate = false;
    this.isEditingDate = false;
    this.onItemEditModalClose();
    this.onModalCloseForAdd();
  }

  onSubmit(formGroup: FormGroup) {
    this.isShowModalForDate = true;
    this.lastUpdateTime = new Date().getTime();
    this.lineService.getById(this.lineId).subscribe(line => {
      this.line = line;
      const dielectricParameter = new DielectricParameter();

      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      const createTime = new Date(formGroup.get(this.formGroupKey.createTime)?.value).getTime();
      dielectricParameter.createTime = createTime;
      dielectricParameter.line = line;
      // console.log('new dielectricParameter', dielectricParameter);
      this.dielectricParameterService.addDielectricParameter(dielectricParameter).subscribe(() => {
        this.commonService.success(() => {
          this.ngOnInit();
          this.formGroupSetNull();
          this.getJustSaveDielectricParameter();
        });
      });
    });
    this.onModalClose();
  }

  getJustSaveDielectricParameter() {
    this.dielectricParameterService.getDielectricParametersByLineId(this.lineId)
      .subscribe(allDielectricParameters => {
        // console.log('getJustSaveDielectricParameter', allDielectricParameters);
        this.currentDielectricParameterId = allDielectricParameters[0].id;
        this.initDielectricParameterItems();
        this.dielectricParameterService.getById(this.currentDielectricParameterId)
          .subscribe(currentDielectricParameter => {
            this.currentDielectricParameter = currentDielectricParameter;
          });
      });
  }

  onSubmitForAddItem(formGroupForAdd: FormGroup) {
    this.lastUpdateTime = new Date().getTime();
    // console.log('dielectricParameter currentDielectricParameterId', this.currentDielectricParameterId);
    // console.log('dielectricParameter currentDielectricParameter', this.currentDielectricParameter);
    // console.log('dielectricParameter onSubmitForAddItem', formGroupForAdd.value);
    const dielectricParameterItem = new DielectricParameterItem();
    dielectricParameterItem.frequency = this.formGroupForAdd.get(this.formGroupKey.frequency)?.value;
    dielectricParameterItem.value = this.formGroupForAdd.get(this.formGroupKey.value)?.value;
    dielectricParameterItem.dielectricParameter = this.currentDielectricParameter;
    dielectricParameterItem.V = this.formGroupForAdd.get(this.formGroupKey.V)?.value;
    this.dielectricParameterService.addDielectricParameterItem(dielectricParameterItem)
      .subscribe(() => {
        // console.log('dielectricParameter 数据新增成功');
        this.commonService.success(() => {
          this.ngOnInit();
          this.onModalCloseForAdd();
          this.initDielectricParameterItems();
          this.formGroupSetNull();
        });
      });
  }

  formGroupSetNull(): void {
    this.formGroup.get(this.formGroupKey.createTime)?.setValue(null);
    this.formGroupForAdd.get(this.formGroupKey.frequency)?.setValue(null);
    this.formGroupForAdd.get(this.formGroupKey.value)?.setValue(null);
    this.formGroupForAdd.get(this.formGroupKey.V)?.setValue(null);
  }

  onDPItemDelete(dielectricParameterItem: DielectricParameterItem) {
    this.commonService.confirm((result) => {
      if (result) {
        this.dielectricParameterItemService.deleteById(dielectricParameterItem.id!)
          .subscribe(() => {
            this.dielectricParameterItems.splice(this.dielectricParameterItems.indexOf(dielectricParameterItem), 1);
            this.commonService.success(() => {
              this.lastUpdateTime = new Date().getTime();
              this.ngOnInit();
            });
          });
      }
    });
  }

  onItemEditModalOpen(dielectricParameterItem: DielectricParameterItem) {
    this.editedDPItem = dielectricParameterItem;
    this.formGroupForAdd.get(this.formGroupKey.frequency)?.setValue(dielectricParameterItem.frequency);
    this.formGroupForAdd.get(this.formGroupKey.value)?.setValue(dielectricParameterItem.value);
    this.formGroupForAdd.get(this.formGroupKey.V)?.setValue(dielectricParameterItem.V);
    this.isShowItemEditModal = true;
    this.currentEditDielectricParameterItem = dielectricParameterItem;
  }
  onItemEditModalClose() {
    this.formGroupSetNull();
    this.isShowItemEditModal = false;
  }

  onItemEditSubmit(formGroupForAdd: FormGroup) {
    this.lastUpdateTime = new Date().getTime();
    this.editedDPItem.frequency = formGroupForAdd.get(this.formGroupKey.frequency)?.value
    this.editedDPItem.value = formGroupForAdd.get(this.formGroupKey.value)?.value
    this.editedDPItem.V = formGroupForAdd.get(this.formGroupKey.V)?.value
    this.dielectricParameterItemService.update(this.editedDPItem)
      .subscribe(() => {
        this.commonService.success(() => {
          this.onItemEditModalClose();
          this.ngOnInit();
        });
      });
  }

  private updateChartData(dielectricParameterItems: DielectricParameterItem[]) {
    const xData: string[] = [];
    const tgData: string[] = [];
    const vData: string[] = [];
    dielectricParameterItems.sort((a, b) => a.frequency! - b.frequency!);
    dielectricParameterItems.forEach(dielectricParameterItem => {
      xData.push(dielectricParameterItem.frequency? dielectricParameterItem.frequency.toString() : '-');
      tgData.push(dielectricParameterItem.value ? dielectricParameterItem.value.toString() : '');
      vData.push(dielectricParameterItem.V ? dielectricParameterItem.V.toString() : '');
    });
    console.log('124124', [...vData]);
    this.echartsOption = {
      xAxis: {
        name: '频率(Hz)',
        data: xData,
      },
      grid: {
        right: '20%'
      },
      legend: {
        data: ['Tg δ', '测试电压(V)']
      },
      yAxis: [{
        name: 'Tg δ',
        type: 'value',
        position: 'left',
        alignTicks: true,
        axisLine: {
          show: true
        }
      }, {
        name: '测试电压(V)',
        type: 'value',
        position: 'right',
        alignTicks: true,
        axisLine: {
          show: true
        },
      }],
      series: [{
        name: 'Tg δ',
        data: tgData,
      }, {
        name: '测试电压(V)',
        data: vData,
        yAxisIndex: 1,
        type: 'line',
        smooth: true
      }]
    };
  }

  onDPDelete(dielectricParameter: DielectricParameter) {
    this.commonService.confirm((result) => {
      if (result) {
        this.dielectricParameterService.deleteById(dielectricParameter.id!)
          .subscribe(() => {
            this.commonService.success(() => {
              this.lastUpdateTime = new Date().getTime();
              this.ngOnInit();
            });
          });
      }
    })
  }

  protected readonly APP_CONFIG = APP_CONFIG;

  onEditDate() {
    const dateNumber = new Date(this.dateControl.value!).getTime();
    this.dielectricParameterService.updateDate(dateNumber, this.currentDielectricParameterId!)
      ?.then((result: DielectricParameter) => {
        // console.log('result', result);
        this.isEditingDate = false;
        this.commonService.success(() => {
          this.ngOnInit();
          if (this.currentDielectricParameter) {
            this.currentDielectricParameter.createTime = result.createTime;
          }
        })
      });
  }

  onStartEditDate() {
    const date = this.datePipe.transform(this.currentDielectricParameter?.createTime, 'yyyy-MM-dd') + '';
    this.dateControl.setValue(date);
    this.isEditingDate = true;
  }
}

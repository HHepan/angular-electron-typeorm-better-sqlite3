import {AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Line} from "../../../../../app/entity/line";
import {LineService} from "../../../../services/line.service";
import {CommonService} from "../../../../services/common.service";
import {CarbonylIndex} from "../../../../../app/entity/carbonyl-index";
import {CarbonylIndexService} from "../../../../services/carbonyl-index.service";
import {PartialDischarge} from "../../../../../app/entity/partial-discharge";
import {EChartsOption} from "echarts";
import {DatePipe} from "@angular/common";
import {APP_CONFIG} from "../../../../environments/environment";
import {log} from "echarts/types/src/util/log";
import {Validator} from "../../../validator/validator";

@Component({
  selector: 'app-carbonyl-index',
  templateUrl: './carbonyl-index.component.html',
  styleUrls: ['./carbonyl-index.component.css']
})
export class CarbonylIndexComponent implements OnInit, AfterViewInit {
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
  // 是否显示添加模态框
  isShowAddModal = false;
  // 是否显示编辑模态框
  isShowEditModal = false;
  // 是否显示更多模态框
  isShowMoreModal = false;
  line: Line | undefined;
  formGroupKey = {
    createDate: 'createDate',
    value: 'value',
    positionLine: 'positionLine',
    position: 'position'
  };
  addGroup = new FormGroup({
    // eslint-disable-next-line @typescript-eslint/unbound-method
    createDate: new FormControl<string>('', [Validators.required]),
    // eslint-disable-next-line @typescript-eslint/unbound-method
    value: new FormControl('', [Validators.required, Validators.min(0)], this.validator.limitNumber(10)),
    // eslint-disable-next-line @typescript-eslint/unbound-method
    positionLine: new FormControl('', [Validators.required]),
    // eslint-disable-next-line @typescript-eslint/unbound-method
    position: new FormControl('', [Validators.required])
  });
  editGroup = new FormGroup({
    // eslint-disable-next-line @typescript-eslint/unbound-method
    createDate: new FormControl<string>('', [Validators.required]),
    // eslint-disable-next-line @typescript-eslint/unbound-method
    value: new FormControl('', [Validators.required, Validators.min(0)], this.validator.limitNumber(10)),
    // eslint-disable-next-line @typescript-eslint/unbound-method
    positionLine: new FormControl('', [Validators.required]),
    // eslint-disable-next-line @typescript-eslint/unbound-method
    position: new FormControl('', [Validators.required])
  });
  carbonylIndexes = [] as CarbonylIndex[];
  // 有限个实体(在图表中显示)
  limitedItems = [] as CarbonylIndex[];
  echartsOption: EChartsOption = {} as EChartsOption;
  editedItem = {} as CarbonylIndex;

  constructor(private lineService: LineService,
              private commonService: CommonService,
              private datePipe: DatePipe,
              private carbonylIndexService: CarbonylIndexService,
              private validator: Validator) {
  }

  ngOnInit(): void {
    this.getAll();
    this.getLine();
  }
  ngAfterViewInit(): void {
    this.commonService.clickButtonDom(this.accordionButton, this._isOpen);
  }
  getLine() {
    this.lineService.getById(this.lineId).subscribe(line => {
      this.line = line;
      this.addGroup.get(this.formGroupKey.positionLine)?.setValue(line.name);
    });
  }

  private getAll() {
    this.carbonylIndexService.getCarbonylIndexsByLineId(this.lineId)
      .subscribe(carbonylIndexes => {
        this.carbonylIndexes = carbonylIndexes;
        this.setEntities(APP_CONFIG.displayItemNumber);
        this.updateChartData(carbonylIndexes);
      });
  }

  private setEntities(num: number) {
    this.limitedItems = this.carbonylIndexes.slice(0, num);
  }



  onModalOpen(modal: 'add' | 'more' | 'edit') {
    switch (modal) {
      case "add":
        console.log('add', this.addGroup.value);
        this.isShowAddModal = true;
        break;
      case "edit":
        this.isShowEditModal = true;
        break;
      case "more":
        this.getAll();
        this.isShowMoreModal = true;
        break;
    }
  }
  onModalClose(modal: 'add' | 'more' | 'edit') {
    switch (modal) {
      case "add":
        this.isShowAddModal = false; break;
      case "edit":
        this.isShowEditModal = false; break;
      case "more":
        this.isShowMoreModal = false; break;
    }
  }
  onSaveSubmit() {
    this.lastUpdateTime = new Date().getTime();
    const carbonylIndex = new CarbonylIndex();
    const createDate = this.addGroup.get('createDate')?.value;
    carbonylIndex.createTime = new Date(createDate!).getTime();
    carbonylIndex.value = this.addGroup.get(this.formGroupKey.value)?.value;
    const position = this.addGroup.get(this.formGroupKey.positionLine)?.value + '线路' + this.addGroup.get(this.formGroupKey.position)?.value + '米处';
    carbonylIndex.position = position!;
    carbonylIndex.line = this.line;
    this.carbonylIndexService.addCarbonylIndex(carbonylIndex).subscribe(() => {
      this.onModalClose("add");
      this.commonService.success(() => {
        this.getAll();
        this.setAddGroupNull();
      });
    });
  }


  private updateChartData(carbonylIndexes: CarbonylIndex[]) {
    const xData: string[] = [];
    const yData: string[] = [];
    const yDataForMax: number[] = [];
    carbonylIndexes.sort((a, b) => a.createTime! - b.createTime!);
    carbonylIndexes.forEach(carbonylIndex => {
      xData.push(this.datePipe.transform(carbonylIndex.createTime, 'yyyy-MM-dd') + '');
      yData.push(carbonylIndex.value ? carbonylIndex?.value.toString() : '');
      yDataForMax.push(carbonylIndex.value ? carbonylIndex?.value : -9999);
    });
    let maxYData = Math.max(...yDataForMax);
    if (maxYData > 10) {
      maxYData = 10;
    }

    this.echartsOption = {
      xAxis: {
        name: '时间',
        data: xData,
      },
      yAxis: {
        name: '羰基指数',
        max: maxYData
      },
      series: [{
        data: yData
      }]
    };
  }

  onDelete(item: CarbonylIndex) {
    this.lastUpdateTime = new Date().getTime();
    this.commonService.confirm((result) => {
      if (result) {
        this.carbonylIndexService.deleteById(item.id)
          .subscribe(a => {
            this.commonService.success(() => {
              this.lastUpdateTime = new Date().getTime();
              this.updateAfterDelete(item);
            });
          });
      }
    });
  }

  private updateAfterDelete(carbonylIndex: CarbonylIndex) {
    this.carbonylIndexes.splice(this.carbonylIndexes.indexOf(carbonylIndex), 1);
    this.limitedItems.splice(this.limitedItems.indexOf(carbonylIndex), 1);
    this.updateChartData(this.carbonylIndexes);
  }

  onEdit(item: CarbonylIndex) {
    this.editedItem = item;
    const createDate = this.datePipe.transform(item.createTime, 'yyyy-MM-dd');
    this.onModalOpen('edit');
    this.editGroup.get(this.formGroupKey.createDate)?.setValue(createDate);
    this.editGroup.get(this.formGroupKey.value)?.setValue(item.value);
    const positionLineAndPosition = this.commonService.extractPositionLineAndPosition(item.position);
    this.editGroup.get(this.formGroupKey.positionLine)?.setValue(positionLineAndPosition[0]);
    this.editGroup.get(this.formGroupKey.position)?.setValue(positionLineAndPosition[1]);
  }

  onEditSubmit() {
    this.lastUpdateTime = new Date().getTime();
    const createDate = this.editGroup.get('createDate')?.value;
    const createTime = new Date(createDate as string).getTime();
    const value = this.editGroup.get('value')?.value;
    const position = this.editGroup.get(this.formGroupKey.positionLine)?.value + '线路' + this.editGroup.get(this.formGroupKey.position)?.value + '米处';
    this.carbonylIndexService.update({id: this.editedItem.id!, createTime, value, position})
      .subscribe(carbonylIndex => {
        this.updateLocalItem(carbonylIndex);
        this.onModalClose('edit');
        this.commonService.success(() => {
          this.updateChartData(this.carbonylIndexes);
        });
      });
  }

  updateLocalItem(carbonylIndex: CarbonylIndex): void {
    this.editedItem.createTime = carbonylIndex.createTime;
    this.editedItem.value = carbonylIndex.value;
    this.carbonylIndexes.forEach(item => {
      if (item.id === carbonylIndex.id) {
        item.createTime = carbonylIndex.createTime;
        item.value = carbonylIndex.value;
        item.position = carbonylIndex.position;
      }
    })
    this.limitedItems.forEach(item => {
      if (item.id == carbonylIndex.id) {
        item.createTime = carbonylIndex.createTime;
        item.value = carbonylIndex.value;
        item.position = carbonylIndex.position;
      }
    })
  }

  private setAddGroupNull() {
    this.addGroup.get(this.formGroupKey.createDate)?.setValue(null);
    this.addGroup.get(this.formGroupKey.value)?.setValue(null);
    this.addGroup.get(this.formGroupKey.position)?.setValue(null);
    this.addGroup.get(this.formGroupKey.positionLine)?.setValue(null);
    this.getLine();
  }

  protected readonly APP_CONFIG = APP_CONFIG;
}

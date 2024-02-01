import {AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Line} from "../../../../../app/entity/line";
import {LineService} from "../../../../services/line.service";
import {CommonService} from "../../../../services/common.service";
import {CrystallinityService} from "../../../../services/crystallinity.service";
import {Crystallinity} from "../../../../../app/entity/crystallinity";
import {EChartsOption} from "echarts";
import {APP_CONFIG} from "../../../../environments/environment";
import {DatePipe} from "@angular/common";

@Component({
  selector: 'app-crystallinity',
  templateUrl: './crystallinity.component.html',
  styleUrls: ['./crystallinity.component.css']
})
export class CrystallinityComponent implements OnInit, AfterViewInit {
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
    value: new FormControl('', [Validators.required]),
    // eslint-disable-next-line @typescript-eslint/unbound-method
    positionLine: new FormControl('', [Validators.required]),
    // eslint-disable-next-line @typescript-eslint/unbound-method
    position: new FormControl('', [Validators.required])
  });
  editGroup = new FormGroup({
    // eslint-disable-next-line @typescript-eslint/unbound-method
    createDate: new FormControl<string>('', [Validators.required]),
    // eslint-disable-next-line @typescript-eslint/unbound-method
    value: new FormControl('', [Validators.required]),
    // eslint-disable-next-line @typescript-eslint/unbound-method
    positionLine: new FormControl('', [Validators.required]),
    // eslint-disable-next-line @typescript-eslint/unbound-method
    position: new FormControl('', [Validators.required])
  });
  crystallinities = [] as Crystallinity[];
  // 有限个实体(在图表中显示)
  limitedItems = [] as Crystallinity[];
  echartsOption: EChartsOption = {} as EChartsOption;
  editedItem = {} as Crystallinity;

  constructor(private lineService: LineService,
              private commonService: CommonService,
              private datePipe: DatePipe,
              private crystallinityService: CrystallinityService) {
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
    this.crystallinityService.getCrystallinitiesByLineId(this.lineId)
      .subscribe(crystallinities => {
        this.crystallinities = crystallinities;
        this.setEntities(APP_CONFIG.displayItemNumber);
        this.updateChartData(crystallinities);
      });
  }

  private setEntities(num: number) {
    this.limitedItems = this.crystallinities.slice(0, num);
  }


  onModalOpen(modal: 'add' | 'more' | 'edit') {
    switch (modal) {
      case "add":
        this.addGroup.setValue({createDate: '', value: '', positionLine: this.line?.name!, position: ''});
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
    this.lineService.getById(this.lineId).subscribe(line => {
      this.line = line;
      const crystallinity = new Crystallinity();
      const createDate = this.addGroup.get('createDate')?.value;
      crystallinity.createTime = new Date(createDate!).getTime();
      crystallinity.value = this.addGroup.get(this.formGroupKey.value)?.value;
      const position = this.addGroup.get(this.formGroupKey.positionLine)?.value + '线路' + this.addGroup.get(this.formGroupKey.position)?.value + '米处';
      crystallinity.position = position!;
      crystallinity.line = line;
      this.crystallinityService.addCrystallinity(crystallinity).subscribe(() => {
        this.onModalClose("add");
        this.commonService.success(() => {
          this.getAll();
        });
      });
    });
  }

  private updateChartData(crystallinities: Crystallinity[]) {
    const xData: string[] = [];
    const yData: string[] = [];
    crystallinities.sort((a, b) => a.createTime! - b.createTime!);
    crystallinities.forEach(score => {
      xData.push(this.datePipe.transform(score.createTime, 'yyyy-MM-dd') + '');
      yData.push(score.value ? score.value.toString() : '');
    });
    this.echartsOption = {
      xAxis: {
        name: '时间',
        data: xData,
      },
      yAxis: {
        name: '结晶度(%)',
        max: 100
      },
      series: [{
        data: yData
      }]
    };
  }

  onDelete(item: Crystallinity) {
    this.commonService.confirm((result) => {
      if (result) {
        this.crystallinityService.deleteById(item.id)
          .subscribe(a => {
            this.commonService.success(() => {
              this.lastUpdateTime = new Date().getTime();
              this.updateAfterDelete(item);
            });
          });
      }
    });
  }

  private updateAfterDelete(crystallinity: Crystallinity) {
    this.crystallinities.splice(this.crystallinities.indexOf(crystallinity), 1);
    this.limitedItems.splice(this.limitedItems.indexOf(crystallinity), 1);
    this.updateChartData(this.crystallinities);
  }

  onEdit(item: Crystallinity) {
    this.editedItem = item;
    const createDate = this.datePipe.transform(item.createTime, 'yyyy-MM-dd');
    const positionLineAndPosition = this.commonService.extractPositionLineAndPosition(item.position);
    this.editGroup.setValue({createDate: createDate, value: item.value!.toString(), positionLine: positionLineAndPosition[0], position: positionLineAndPosition[1]});
    this.onModalOpen('edit');
  }

  onEditSubmit() {
    this.lastUpdateTime = new Date().getTime();
    const createDate = this.editGroup.get('createDate')?.value;
    const createTime = new Date(createDate as string).getTime();
    const value = this.editGroup.get('value')?.value;
    const position = this.editGroup.get(this.formGroupKey.positionLine)?.value + '线路' + this.editGroup.get(this.formGroupKey.position)?.value + '米处';
    this.crystallinityService.update({id: this.editedItem.id!, createTime, value: value?.toString(), position})
      .subscribe(crystallinity => {
        this.updateLocalItem(crystallinity);
        this.onModalClose('edit');
        this.commonService.success(() => {
          this.updateChartData(this.crystallinities);
        });
      });
  }

  updateLocalItem(crystallinity: Crystallinity): void {
    this.editedItem.createTime = crystallinity.createTime;
    this.editedItem.value = crystallinity.value;
    this.crystallinities.forEach(item => {
      if (item.id === crystallinity.id) {
        item.createTime = crystallinity.createTime;
        item.value = crystallinity.value;
        item.position = crystallinity.position;
      }
    })
    this.limitedItems.forEach(item => {
      if (item.id == crystallinity.id) {
        item.createTime = crystallinity.createTime;
        item.value = crystallinity.value;
        item.position = crystallinity.position;
      }
    })
  }

  protected readonly APP_CONFIG = APP_CONFIG;
}

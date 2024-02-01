import {AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Line} from "../../../../../app/entity/line";
import {LineService} from "../../../../services/line.service";
import {CommonService} from "../../../../services/common.service";
import {BreakingElongation} from "../../../../../app/entity/breaking-elongation";
import {BreakingElongationService} from "../../../../services/breaking-elongation.service";
import {EChartsOption} from "echarts";
import {DatePipe} from "@angular/common";
import {APP_CONFIG} from "../../../../environments/environment";
import {Validator} from "../../../validator/validator";

@Component({
  selector: 'app-breaking-elongation',
  templateUrl: './breaking-elongation.component.html',
  styleUrls: ['./breaking-elongation.component.css']
})
export class BreakingElongationComponent implements OnInit, AfterViewInit {
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
    value: new FormControl('', [Validators.required, Validators.min(0)], this.validator.limitNumber(1000)),
    // eslint-disable-next-line @typescript-eslint/unbound-method
    positionLine: new FormControl('', [Validators.required]),
    // eslint-disable-next-line @typescript-eslint/unbound-method
    position: new FormControl('', [Validators.required])
  });
  editGroup = new FormGroup({
    // eslint-disable-next-line @typescript-eslint/unbound-method
    createDate: new FormControl<string>('', [Validators.required]),
    // eslint-disable-next-line @typescript-eslint/unbound-method
    value: new FormControl('', [Validators.required, Validators.min(0)], this.validator.limitNumber(1000)),
    // eslint-disable-next-line @typescript-eslint/unbound-method
    positionLine: new FormControl('', [Validators.required]),
    // eslint-disable-next-line @typescript-eslint/unbound-method
    position: new FormControl('', [Validators.required])
  });

  // 所有实体
  breakingElongations = [] as BreakingElongation[];
  // 有限个实体(在图表中显示)
  limitedItems = [] as BreakingElongation[];
  echartsOption: EChartsOption = {} as EChartsOption;
  editedItem = {} as BreakingElongation;

  constructor(private lineService: LineService,
              private commonService: CommonService,
              private datePipe: DatePipe,
              private breakingElongationService: BreakingElongationService,
              private validator: Validator) {
  }

  ngAfterViewInit(): void {
    this.commonService.clickButtonDom(this.accordionButton, this._isOpen);
  }
  ngOnInit(): void {
    this.getAll();
    this.getLine();
  }
  getLine() {
    this.lineService.getById(this.lineId).subscribe(line => {
      this.line = line;
      this.addGroup.get(this.formGroupKey.positionLine)?.setValue(line.name);
    });
  }


  private getAll() {
    this.breakingElongationService.getBreakingElongationsByLineId(this.lineId)
      .subscribe(breakingElongations => {
        this.breakingElongations = breakingElongations;
        this.setEntities(APP_CONFIG.displayItemNumber);
        this.updateChartData(breakingElongations);
      });
  }

  private setEntities(num: number) {
    this.limitedItems = this.breakingElongations.slice(0, num);
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
      const breakingElongation = new BreakingElongation();
      const createDate = this.addGroup.get('createDate')?.value;
      breakingElongation.createTime = new Date(createDate!).getTime();
      breakingElongation.value = this.addGroup.get(this.formGroupKey.value)?.value;
      const position = this.addGroup.get(this.formGroupKey.positionLine)?.value + '线路' + this.addGroup.get(this.formGroupKey.position)?.value + '米处';
      breakingElongation.position = position!;
      breakingElongation.line = line;
      this.breakingElongationService.addBreakingElongation(breakingElongation).subscribe(() => {
        this.onModalClose("add");
        this.commonService.success(() => {
          this.getAll();
        });
      });
    });
  }


  private updateChartData(breakingElongations: BreakingElongation[]) {
    const xData: string[] = [];
    const yData: string[] = [];
    const yDataForMax: number[] = [];
    breakingElongations.sort((a, b) => a.createTime! - b.createTime!);
    breakingElongations.forEach(score => {
      xData.push(this.datePipe.transform(score.createTime, 'yyyy-MM-dd') + '');
      yData.push(score.value ? score.value.toString() : '');
      yDataForMax.push(score.value ? score.value : -99999);
    });
    let maxYData = Math.max(...yDataForMax);
    if (maxYData > 1000) {
      maxYData = 1000;
    }
    this.echartsOption = {
      xAxis: {
        name: '时间',
        data: xData,
      },
      yAxis: {
        name: '断裂伸长率(%)',
        max: maxYData
      },
      series: [{
        data: yData
      }]
    };
  }

  onDelete(item: BreakingElongation) {
    this.commonService.confirm((result) => {
      if (result) {
        this.breakingElongationService.deleteById(item.id)
          .subscribe(a => {
            this.commonService.success(() => {
              this.lastUpdateTime = new Date().getTime();
              this.updateAfterDelete(item);
            });
          });
      }
    });
  }

  private updateAfterDelete(breakingElongation: BreakingElongation) {
    this.breakingElongations.splice(this.breakingElongations.indexOf(breakingElongation), 1);
    this.limitedItems.splice(this.limitedItems.indexOf(breakingElongation), 1);
    this.updateChartData(this.breakingElongations);
  }

  onEdit(item: BreakingElongation) {
    this.editedItem = item;
    const createDate = this.datePipe.transform(item.createTime, 'yyyy-MM-dd');
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
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
    console.log('onEditSubmit', position);
    this.breakingElongationService.update({id: this.editedItem.id!, createTime, value: value?.toString(), position})
      .subscribe(item => {
        this.updateLocalItem(item);
        this.onModalClose('edit');
        this.commonService.success(() => {
          this.updateChartData(this.breakingElongations);
        });
      });
  }

  updateLocalItem(breakingElongation: BreakingElongation): void {
    this.lastUpdateTime = new Date().getTime();
    this.editedItem.createTime = breakingElongation.createTime;
    this.editedItem.value = breakingElongation.value;
    this.breakingElongations.forEach(item => {
      if (item.id === breakingElongation.id) {
        item.createTime = breakingElongation.createTime;
        item.value = breakingElongation.value;
        item.position = breakingElongation.position;
      }
    })
    this.limitedItems.forEach(item => {
      if (item.id == breakingElongation.id) {
        item.createTime = breakingElongation.createTime;
        item.value = breakingElongation.value;
        item.position = breakingElongation.position;
      }
    })

  }

  protected readonly APP_CONFIG = APP_CONFIG;
}

import {AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {Score} from "../../../../../app/entity/score";
import {ScoreService} from "../../../../services/score.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {CommonService} from "../../../../services/common.service";
import {APP_CONFIG} from "../../../../environments/environment";
import {DatePipe} from "@angular/common";
import {EChartsOption} from "echarts";
import {RecordService} from "../../../../services/record.service";

@Component({
  selector: 'app-score',
  templateUrl: './score.component.html',
  styleUrls: ['./score.component.css']
})
export class ScoreComponent implements OnInit, AfterViewInit {
  @Output() sendDataToParent = new EventEmitter<any>();
  @Input() lineId: number | undefined;
  @Input() set updateTime(time: number | null) {
    this.lastUpdateTime = time;
  }
  lastUpdateTime: number | null = null;
  @Input()
  set isOpen(isOpen: boolean) {
    this._isOpen = isOpen;
    this.commonService.clickButtonDom(this.accordionButton, isOpen);
  }

  @Input()
  recordTypes: (string | undefined)[] | undefined;
  _isOpen = false;
  @ViewChild('accordionButton') accordionButton: ElementRef<HTMLButtonElement> | undefined;
  // 表格中显示的score
  scores: Score[] = [];
  // 正在被编辑的score
  editedScore: Score = {} as Score;
  // 所有的score
  allScores: Score[] = [];
  // 是否显示添加模态框
  isShowAddModal = false;
  // 是否显示编辑模态框
  isShowEditModal = false;
  // 是否显示更多模态框
  isShowMoreModal = false;
  addGroup = new FormGroup({
    // eslint-disable-next-line @typescript-eslint/unbound-method
    createDate: new FormControl<string>('', [Validators.required]),
    // eslint-disable-next-line @typescript-eslint/unbound-method
    value: new FormControl<number>(0, [Validators.required])
  });
  editGroup = new FormGroup({
    // eslint-disable-next-line @typescript-eslint/unbound-method
    createDate: new FormControl<string>('', [Validators.required]),
    // eslint-disable-next-line @typescript-eslint/unbound-method
    value: new FormControl<number>(0, [Validators.required])
  });
  echartsOption: EChartsOption = {} as EChartsOption;

  constructor(private scoreService: ScoreService,
              private commonService: CommonService,
              private recordService: RecordService,
              private datePipe: DatePipe) {
  }

  ngAfterViewInit(): void {
    this.commonService.clickButtonDom(this.accordionButton, this._isOpen);
  }
  ngOnInit(): void {
    this.getAll();
    this.getEntities(APP_CONFIG.displayItemNumber);
  }

  onModalOpen(modal: 'add' | 'more' | 'edit') {
    switch (modal) {
      case "add":
        this.addGroup.setValue({createDate: '', value: 0});
        if (this.lineId === undefined ) break;
        this.recordService.save(this.recordTypes as string[], this.lineId);
        this.commonService.success(() => {
          this.getEntities(APP_CONFIG.displayItemNumber);
          this.getAll();
          this.onModalClose("add");
          this.sendDataToParent.emit();
        });
        // this.isShowAddModal = true;
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
    const createDate = this.addGroup.get('createDate')?.value;
    const createTime = new Date(createDate!).getTime();
    const value = this.addGroup.get('value')?.value;
    this.scoreService.add({lineId: this.lineId, createTime, value})
      .subscribe(score => {
        this.commonService.success(() => {
          this.getEntities(APP_CONFIG.displayItemNumber);
          this.getAll();
          this.onModalClose("add");
          this.sendDataToParent.emit();
        });
      });
  }

  private getEntities(num: number) {
    this.scoreService.getScoresByLineId(this.lineId, num)
      .subscribe(scores => {
        scores.sort((a, b) => b.createTime! - a.createTime!);
        this.scores = scores;
      });
  }

  private getAll() {
    this.scoreService.getAllByLineId(this.lineId!)
      .subscribe(allScores => {
        this.allScores = allScores;
        this.updateChartData(allScores);
      });
  }

  onDelete(score: Score): void {
    this.commonService.confirm((result) => {
      if (result) {
        this.scoreService.deleteById(score.id)
          .subscribe(a => {
            this.commonService.success(() => {
              this.lastUpdateTime = new Date().getTime();
              this.updateAfterDelete(score);
            });
          });
      }
    });
  }

  onEdit(score: Score) {
    this.editedScore = score;
    const createDate = this.datePipe.transform(score.createTime, 'yyyy-MM-dd');
    this.editGroup.setValue({createDate: createDate, value: score.value!});
    this.onModalOpen('edit');
  }

  onEditSubmit(): void {
    this.lastUpdateTime = new Date().getTime();
    const createDate = this.editGroup.get('createDate')?.value;
    const createTime = new Date(createDate as string).getTime();
    const value = this.editGroup.get('value')?.value;
    this.scoreService.update({id: this.editedScore.id, createTime, value})
      .subscribe(score => {
        this.updateLocalScore(score);
        this.commonService.success(() => {
          this.updateChartData(this.allScores);
          this.onModalClose('edit');
          this.sendDataToParent.emit();
        });
      });
  }

  /*更新本地对象*/
  private updateLocalScore(score: Score) {
    this.editedScore.createTime = score.createTime;
    this.editedScore.value = score.value;
    this.allScores.forEach(item => {
      if (item.id === score.id) {
        item.createTime = score.createTime;
        item.value = score.value;
      }
    })
    this.scores.forEach(item => {
      if (item.id == score.id) {
        item.createTime = score.createTime;
        item.value = score.value;
      }
    })
  }

  private updateAfterDelete(score: Score) {
    this.allScores.splice(this.allScores.indexOf(score), 1);
    this.scores.splice(this.allScores.indexOf(score), 1);
    this.updateChartData(this.allScores);
    this.sendDataToParent.emit();
  }

  private updateChartData(allScores: Score[]) {
    const xData: string[] = [];
    const yData: string[] = [];
    allScores.sort((a, b) => a.createTime! - b.createTime!);
    allScores.forEach(score => {
      xData.push(this.datePipe.transform(score.createTime, 'yyyy-MM-dd') + '');
      yData.push(score.value ? score.value.toString() : '');
    });
    this.echartsOption = {
      xAxis: {
        name: '时间',
        data: xData,
      },
      yAxis: {
        name: '评分',
        max: 100
      },
      series: [{
        data: yData
      }]
    };
  }

  protected readonly APP_CONFIG = APP_CONFIG;
}

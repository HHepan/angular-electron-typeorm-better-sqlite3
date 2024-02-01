import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {LineService} from "../../services/line.service";
import {CommonService} from "../../services/common.service";
import {Line} from "../../../app/entity/line";
import {ScoreService} from "../../services/score.service";
import {recordKey} from "../key";

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css']
})
export class ViewComponent implements OnInit {
  id: number | undefined;
  isShowModal = false;
  formGroup: FormGroup;
  line: Line | undefined;
  lastScore: number | undefined;
  switchFormControl = new FormControl<boolean>(false);
  // accordion是否展开
  isOpenRecord = {
    score: true,
    dielectricParameter: false,
    partialDischarge: false,
    landingSectionTemperature: false,
    conductivity: false,
    breakdownFieldStrength: false,
    carbonylIndex: false,
    crystallinity: false,
    breakingElongation: false
  } as Record<string, boolean>;

  updateTimeRecord: Record<string, number | null> = {};

  formGroupKey = recordKey;
  recordTypes: (string | undefined)[] | undefined;

  constructor(private route: ActivatedRoute,
              private lineService: LineService,
              private commonService: CommonService,
              private scoreService: ScoreService) {
    this.id = +this.route.snapshot.params.id;
    this.formGroup = new FormGroup({
      // eslint-disable-next-line @typescript-eslint/unbound-method
      score: new FormControl('', [Validators.required]),
      // eslint-disable-next-line @typescript-eslint/unbound-method
      dielectricParameter: new FormControl('', [Validators.required]),
      // eslint-disable-next-line @typescript-eslint/unbound-method
      partialDischarge: new FormControl('', [Validators.required]),
      // eslint-disable-next-line @typescript-eslint/unbound-method
      landingSectionTemperature: new FormControl('', [Validators.required]),
      // eslint-disable-next-line @typescript-eslint/unbound-method
      conductivity: new FormControl('', [Validators.required]),
      // eslint-disable-next-line @typescript-eslint/unbound-method
      breakdownFieldStrength: new FormControl('', [Validators.required]),
      // eslint-disable-next-line @typescript-eslint/unbound-method
      carbonylIndex: new FormControl('', [Validators.required]),
      // eslint-disable-next-line @typescript-eslint/unbound-method
      crystallinity: new FormControl('', [Validators.required]),
      // eslint-disable-next-line @typescript-eslint/unbound-method
      breakingElongation: new FormControl('', [Validators.required]),
    });
  }

  ngOnInit(): void {
    this.lineService.getById(this.id).subscribe(currentLine => {
      this.line = currentLine;
      this.recordTypes = currentLine.recordTypes?.map(recordType => recordType.name);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return,@typescript-eslint/no-unsafe-argument
      this.setFormGroup(this.recordTypes?.join(','));
      this.initUpdateTimeRecord(currentLine);
    });
    if (this.id !== undefined) {
      this.scoreService.getAllByLineId(this.id)
        .subscribe(allScores => {
          allScores.sort((a, b) => a.createTime! - b.createTime!);
          if (allScores.length > 0) {
            this.lastScore = allScores[allScores.length - 1].value;
          } else {
            this.lastScore = -1;
          }
        });
    }
    this.switchFormControl.valueChanges.subscribe(value => {
      this.toggleAccordion(value)
    })
  }

  onModalClose(): void {
    this.isShowModal = false;
  }

  onOpenModal() {
    this.isShowModal = true;
  }

  onTypeUpdate(formGroup: FormGroup) {
    this.formGroup.get(this.formGroupKey.score)?.setValue(true);
    const recordTypes = [] as string[];
    for (const formGroupKeyItem in this.formGroupKey) {
      if (formGroup.get(formGroupKeyItem)?.value) {
        recordTypes.push(formGroupKeyItem);
      }
    }
    this.lineService.updateLineRecordTypes(this.id, recordTypes).subscribe(() => {
      this.commonService.success(() => {
        this.ngOnInit();
        this.onModalClose();
      });
    });
  }

  setFormGroup(types: string | undefined) {
    if (types?.includes(this.formGroupKey.dielectricParameter)) {
      this.formGroup.get(this.formGroupKey.dielectricParameter)?.setValue(true);
    } else {
      this.formGroup.get(this.formGroupKey.dielectricParameter)?.setValue(false);
    }
    if (types?.includes(this.formGroupKey.partialDischarge)) {
      this.formGroup.get(this.formGroupKey.partialDischarge)?.setValue(true);
    } else {
      this.formGroup.get(this.formGroupKey.partialDischarge)?.setValue(false);
    }
    if (types?.includes(this.formGroupKey.landingSectionTemperature)) {
      this.formGroup.get(this.formGroupKey.landingSectionTemperature)?.setValue(true);
    } else {
      this.formGroup.get(this.formGroupKey.landingSectionTemperature)?.setValue(false);
    }
    if (types?.includes(this.formGroupKey.conductivity)) {
      this.formGroup.get(this.formGroupKey.conductivity)?.setValue(true);
    } else {
      this.formGroup.get(this.formGroupKey.conductivity)?.setValue(false);
    }
    if (types?.includes(this.formGroupKey.breakdownFieldStrength)) {
      this.formGroup.get(this.formGroupKey.breakdownFieldStrength)?.setValue(true);
    } else {
      this.formGroup.get(this.formGroupKey.breakdownFieldStrength)?.setValue(false);
    }
    if (types?.includes(this.formGroupKey.carbonylIndex)) {
      this.formGroup.get(this.formGroupKey.carbonylIndex)?.setValue(true);
    } else {
      this.formGroup.get(this.formGroupKey.carbonylIndex)?.setValue(false);
    }
    if (types?.includes(this.formGroupKey.crystallinity)) {
      this.formGroup.get(this.formGroupKey.crystallinity)?.setValue(true);
    } else {
      this.formGroup.get(this.formGroupKey.crystallinity)?.setValue(false);
    }
    if (types?.includes(this.formGroupKey.breakingElongation)) {
      this.formGroup.get(this.formGroupKey.breakingElongation)?.setValue(true);
    } else {
      this.formGroup.get(this.formGroupKey.breakingElongation)?.setValue(false);
    }
  }

  handleDataFromChild($event: any) {
    this.ngOnInit();
  }

  isOpen(key: string) {
    return this.isOpenRecord[key] == undefined ? false : this.isOpenRecord[key];
  }

  toggleAccordion(value: boolean | null) {
    for (const openRecordKey in this.isOpenRecord) {
      this.isOpenRecord[openRecordKey] = value === null ? false : value;
    }
  }

  private initUpdateTimeRecord(currentLine: Line) {
    for (const formGroupKeyItem in this.formGroupKey) {
      this.updateTimeRecord[formGroupKeyItem] = null;
    }
    currentLine.recordTypes?.forEach(recordType => {
      if (recordType.name) {
        this.updateTimeRecord[recordType.name] = recordType.updateTime!;
      }
    })
  }

  getUpdateTime(key: string) {
    return this.updateTimeRecord[key];
  }

  protected readonly recordKey = recordKey;
}

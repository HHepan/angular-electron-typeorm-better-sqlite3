import { Component } from '@angular/core';
import {CommonService} from "../../../services/common.service";
import {IndexService} from "../../../services/index.service";
import {Item} from "../../../../app/entity/item";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {IndexSubjectService} from "../../../services/subjects/index-subject.service";

@Component({
  selector: 'app-index-add',
  templateUrl: './index-add.component.html',
  styleUrls: ['./index-add.component.scss']
})
export class IndexAddComponent {
  formGroup = new FormGroup({
    name: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required])
  });
  key = {
    name: 'name',
    description: 'description'
  };
  constructor(private commonService:CommonService,
              private indexService: IndexService,
              private indexSubjectService: IndexSubjectService) {
  }

  onClose() {
    this.commonService.back();
  }

  onSubmit() {
    const item = new Item();
    item.name = this.formGroup.get(this.key.name)?.value;
    item.description = this.formGroup.get(this.key.description)?.value;
    this.indexService.add(item).subscribe(() => {
      this.onClose();
      this.commonService.success();
      this.indexSubjectService.addFinish();
    });
  }
}

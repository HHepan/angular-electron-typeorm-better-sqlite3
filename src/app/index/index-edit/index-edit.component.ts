import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {CommonService} from "../../../services/common.service";
import {IndexService} from "../../../services/index.service";
import {IndexSubjectService} from "../../../services/subjects/index-subject.service";
import {ActivatedRoute} from "@angular/router";
import {Item} from "../../../../app/entity/item";

@Component({
  selector: 'app-index-edit',
  templateUrl: './index-edit.component.html',
  styleUrls: ['./index-edit.component.scss']
})
export class IndexEditComponent implements OnInit {
  formGroup = new FormGroup({
    name: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required])
  });
  key = {
    name: 'name',
    description: 'description'
  };
  itemId: number | undefined;
  currentItem: Item | undefined;

  constructor(private commonService:CommonService,
              private indexService: IndexService,
              private indexSubjectService: IndexSubjectService,
              private activeRoute: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.itemId = this.activeRoute.snapshot.params['id'];
    console.log('itemId', this.itemId);
    if (this.itemId !== undefined) {
      this.getCurrentItem(this.itemId);
    }
  }

  onClose() {
    this.commonService.back();
  }

  onSubmit() {
    const newItem = new Item();
    newItem.name = this.formGroup.get(this.key.name)?.value;
    newItem.description = this.formGroup.get(this.key.description)?.value;
    newItem.id = this.itemId;
    this.indexService.update(newItem).subscribe(() => {
      this.onClose();
      this.commonService.success();
      this.indexSubjectService.addFinish();
    });
  }

  private getCurrentItem(itemId: number) {
    this.indexService.getById(itemId).subscribe(item => {
      this.currentItem = item;
      this.setFormGroup(this.currentItem);
    });
  }

  private setFormGroup(currentItem: Item | undefined) {
    if (currentItem !== undefined) {
      this.formGroup.get(this.key.name)?.setValue(currentItem.name);
      this.formGroup.get(this.key.description)?.setValue(currentItem.description);
    }
  }
}

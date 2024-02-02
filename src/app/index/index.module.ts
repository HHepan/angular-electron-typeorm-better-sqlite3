import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IndexComponent } from './index.component';
import {IndexRoutingModule} from "./index-routing.module";
import {IndexService} from "../../services/index.service";
import { IndexAddComponent } from './index-add/index-add.component';
import {DialogEntryModule} from "../common/dialog-entry/dialog-entry.module";
import {ReactiveFormsModule} from "@angular/forms";
import {IndexSubjectService} from "../../services/subjects/index-subject.service";
import { IndexEditComponent } from './index-edit/index-edit.component';



@NgModule({
  declarations: [
    IndexComponent,
    IndexAddComponent,
    IndexEditComponent
  ],
  imports: [
    CommonModule,
    IndexRoutingModule,
    DialogEntryModule,
    ReactiveFormsModule
  ],
  providers: [IndexService, IndexSubjectService]
})
export class IndexModule { }

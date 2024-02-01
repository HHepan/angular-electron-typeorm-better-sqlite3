import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ViewComponent} from "./view.component";
import {ViewRoutingModule} from "./view-routing.module";
import {RecordModule} from "../share/records/record.module";
import {YzModalModule} from "../share/yz-modal/yz-modal.module";
import {ReactiveFormsModule} from "@angular/forms";


@NgModule({
  declarations: [ViewComponent],
    imports: [
        CommonModule,
        ViewRoutingModule,
        RecordModule,
        YzModalModule,
        ReactiveFormsModule
    ]
})
export class ViewModule { }

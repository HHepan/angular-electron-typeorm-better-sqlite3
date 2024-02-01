import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LineComponent } from './line.component';
import {LineRoutingModule} from "./line-routing.module";
import { LineAddComponent } from './line-add/line-add.component';
import { LineEditComponent } from './line-edit/line-edit.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {LineService} from "../../services/line.service";
import {ElectronService} from "../../services/electron.service";
import {YzModalModule} from "../share/yz-modal/yz-modal.module";
import {DateInputRestrictionModule} from "../../directive/DateInputRestrictionDirective";

@NgModule({
  declarations: [
    LineComponent,
    LineAddComponent,
    LineEditComponent
  ],
  imports: [
    CommonModule,
    LineRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    YzModalModule,
    DateInputRestrictionModule
  ],
  providers: [ElectronService, LineService]
})
export class LineModule { }

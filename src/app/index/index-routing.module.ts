import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from "@angular/router";
import {IndexComponent} from "./index.component";
import {DialogEntryComponent} from "../common/dialog-entry/dialog-entry.component";
import {IndexAddComponent} from "./index-add/index-add.component";
import {IndexEditComponent} from "./index-edit/index-edit.component";

const routes: Routes = [
  {
    path: '',
    component: IndexComponent,
    children: [
      {
        path: 'add',
        component: DialogEntryComponent,
        data: {
          component: IndexAddComponent
        }
      },
      {
        path: 'edit/:id',
        component: DialogEntryComponent,
        data: {
          component: IndexEditComponent
        }
      }
    ]
  },
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class IndexRoutingModule { }

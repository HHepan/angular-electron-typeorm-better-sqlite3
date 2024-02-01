import { NgModule } from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {Component1Component} from './component1.component';

const routes: Routes = [
  {
    path: '',
    component: Component1Component,
    data: {
      title: '列表'
    }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Component1RoutingModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Component1Component } from './component1.component';
import {Component1RoutingModule} from './component1-routing.module';



@NgModule({
  declarations: [Component1Component],
  imports: [
    CommonModule,
    Component1RoutingModule
  ]
})
export class Component1Module { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Component2Component } from './component2.component';
import {Component2RoutingModule} from './component2-routing.module';



@NgModule({
  declarations: [Component2Component],
  imports: [
    CommonModule,
    Component2RoutingModule
  ]
})
export class Component2Module { }

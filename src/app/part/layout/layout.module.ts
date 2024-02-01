import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {LayoutComponent} from './layout.component';
import {MenuModule} from '../menu/menu.module';
import {RouterModule} from '@angular/router';



@NgModule({
  declarations: [LayoutComponent],
  imports: [
    CommonModule,
    MenuModule,
    RouterModule,
  ]
})
export class LayoutModule { }

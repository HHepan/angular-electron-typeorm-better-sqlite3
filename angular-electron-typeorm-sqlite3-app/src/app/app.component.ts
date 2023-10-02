import { Component, OnInit } from '@angular/core';
import {Item} from "../assets/entities/item.entity";
import {AppService} from "./app.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'angular-electron-app';
  itemList = [] as Item[];
  constructor(private appService: AppService) {}

  ngOnInit(): void {
    console.log('component initialized');
    this.appService.getItems().subscribe((items) => (this.itemList = items));
  }

  addItem(): void {
    let item = new Item();
    item.name = 'Item ' + this.itemList.length;
    this.appService.addItem(item).subscribe((items) => (this.itemList = items));
  }

  deleteItem(): void {
    const item = this.itemList[this.itemList.length - 1];
    this.appService
      .deleteItem(item)
      .subscribe((items) => (this.itemList = items));
  }
}

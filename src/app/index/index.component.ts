import { Component } from '@angular/core';
import {Item} from "../../../app/entity/item";
import {IndexService} from "../../services/index.service";

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent {
  constructor(private indexService: IndexService) {
  }

  addItem() {
    const item = new Item();
    item.name = 'test';
    this.indexService.addItem(item).subscribe(() => {
      console.log("add item success")
    });
  }
}

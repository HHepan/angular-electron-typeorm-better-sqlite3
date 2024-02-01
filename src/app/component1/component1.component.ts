import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-component1',
  templateUrl: './component1.component.html',
  styleUrls: ['./component1.component.css']
})
export class Component1Component implements OnInit {
  itemArr: number[] = [];

  constructor() { }

  ngOnInit(): void {
    for (let i = 0; i < 40; i++) {
      this.itemArr.push(i);
    }
  }

}

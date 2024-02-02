import {Component, OnInit} from '@angular/core';
import {Item} from "../../../app/entity/item";
import {IndexService} from "../../services/index.service";
import {IndexSubjectService} from "../../services/subjects/index-subject.service";
import {CommonService} from "../../services/common.service";
import {ActivatedRoute, Router} from "@angular/router";
import {FormControl} from "@angular/forms";

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {
  allItems: Item[] = [];
  showMenu = false;
  selectItem: Item | undefined;
  searchName = new FormControl('');
  constructor(private indexService: IndexService,
              private indexSubjectService: IndexSubjectService,
              private commonService: CommonService,
              private router: Router,
              private activeRoute: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.getAll();
    const subject = this.indexSubjectService.getIndexSubject();
    subject.subscribe(res => {
      const keys = this.indexSubjectService.getEventKeys();
      if (res === keys.addFinish) {
        this.getAll();
      }
    });
  }

  getAll() {
    const searchName = this.searchName.value;
    this.indexService.getAll(searchName).subscribe(items => {
      this.allItems = items;
    });
  }

  showContextMenu(event: MouseEvent, item: Item) {
    event.preventDefault();
    this.showMenu = true;
    this.selectItem = item;
    this.setPosition(event.clientX, event.clientY);
  }

  setPosition(x: number, y: number) {
    const menu = document.querySelector('.context-menu') as HTMLElement;
    menu.style.left = (x - 220).toString() + 'px';
    menu.style.top = y.toString() + 'px';
  }

  onBodyClick() {
    this.showMenu = false;
  }

  onDelete(item: Item | undefined) {
    this.showMenu = false;
    if (item !== undefined) {
      this.commonService.confirm((confirm: any) => {
        if (confirm) {
          this.indexService.delete(item).subscribe(() => {
            this.getAll();
            this.commonService.success();
          });
        }
      }, '确认删除数据' + item.name + '?');
    }
  }

  onEdit(item: Item | undefined) {
    if (item !== undefined) {
      this.showMenu = false;
      this.router.navigate(['edit/' + item.id] , {relativeTo: this.activeRoute}).then(r => console.log(r));
    }
  }
}

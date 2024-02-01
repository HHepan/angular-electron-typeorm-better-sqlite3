import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LineComponent } from './line.component';
import {RouterTestingModule} from "@angular/router/testing";
import {LineService} from "../../services/line.service";

describe('LineComponent', () => {
  let component: LineComponent;
  let fixture: ComponentFixture<LineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LineComponent ],
      imports: [RouterTestingModule],
      providers: [LineService]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  fit('should create', () => {
      expect(component).toBeTruthy();
  });
});

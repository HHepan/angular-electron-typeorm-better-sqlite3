import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LineEditComponent } from './line-edit.component';

describe('LineEditComponent', () => {
  let component: LineEditComponent;
  let fixture: ComponentFixture<LineEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LineEditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LineEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

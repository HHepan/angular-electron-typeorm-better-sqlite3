import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BreakdownFieldStrengthComponent } from './breakdown-field-strength.component';

describe('BreakdownFieldStrengthComponent', () => {
  let component: BreakdownFieldStrengthComponent;
  let fixture: ComponentFixture<BreakdownFieldStrengthComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BreakdownFieldStrengthComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BreakdownFieldStrengthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartialDischargeComponent } from './partial-discharge.component';

describe('PartialDischargeComponent', () => {
  let component: PartialDischargeComponent;
  let fixture: ComponentFixture<PartialDischargeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PartialDischargeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PartialDischargeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

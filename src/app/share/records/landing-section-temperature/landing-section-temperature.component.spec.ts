import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LandingSectionTemperatureComponent } from './landing-section-temperature.component';

describe('LandingSectionTemperatureComponent', () => {
  let component: LandingSectionTemperatureComponent;
  let fixture: ComponentFixture<LandingSectionTemperatureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LandingSectionTemperatureComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LandingSectionTemperatureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

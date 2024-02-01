import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DielectricParameterComponent } from './dielectric-parameter.component';

describe('DielectricParameterComponent', () => {
  let component: DielectricParameterComponent;
  let fixture: ComponentFixture<DielectricParameterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DielectricParameterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DielectricParameterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

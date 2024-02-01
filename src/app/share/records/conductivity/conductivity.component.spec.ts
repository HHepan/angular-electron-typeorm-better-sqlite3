import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConductivityComponent } from './conductivity.component';

describe('ConductivityComponent', () => {
  let component: ConductivityComponent;
  let fixture: ComponentFixture<ConductivityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConductivityComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConductivityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

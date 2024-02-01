import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarbonylIndexComponent } from './carbonyl-index.component';

describe('CarbonylIndexComponent', () => {
  let component: CarbonylIndexComponent;
  let fixture: ComponentFixture<CarbonylIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CarbonylIndexComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CarbonylIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

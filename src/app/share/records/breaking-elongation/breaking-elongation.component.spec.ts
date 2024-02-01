import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BreakingElongationComponent } from './breaking-elongation.component';

describe('BreakingElongationComponent', () => {
  let component: BreakingElongationComponent;
  let fixture: ComponentFixture<BreakingElongationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BreakingElongationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BreakingElongationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

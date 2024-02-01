import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrystallinityComponent } from './crystallinity.component';

describe('CrystallinityComponent', () => {
  let component: CrystallinityComponent;
  let fixture: ComponentFixture<CrystallinityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CrystallinityComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrystallinityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

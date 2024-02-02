import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndexEditComponent } from './index-edit.component';

describe('IndexEditComponent', () => {
  let component: IndexEditComponent;
  let fixture: ComponentFixture<IndexEditComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [IndexEditComponent]
    });
    fixture = TestBed.createComponent(IndexEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

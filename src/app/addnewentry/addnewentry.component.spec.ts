import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddnewentryComponent } from './addnewentry.component';

describe('AddnewentryComponent', () => {
  let component: AddnewentryComponent;
  let fixture: ComponentFixture<AddnewentryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddnewentryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddnewentryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

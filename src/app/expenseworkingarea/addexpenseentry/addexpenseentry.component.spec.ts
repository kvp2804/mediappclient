import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddexpenseentryComponent } from './addexpenseentry.component';

describe('AddexpenseentryComponent', () => {
  let component: AddexpenseentryComponent;
  let fixture: ComponentFixture<AddexpenseentryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddexpenseentryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddexpenseentryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

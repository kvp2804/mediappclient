import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddincomeentryComponent } from './addincomeentry.component';

describe('AddincomeentryComponent', () => {
  let component: AddincomeentryComponent;
  let fixture: ComponentFixture<AddincomeentryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddincomeentryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddincomeentryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

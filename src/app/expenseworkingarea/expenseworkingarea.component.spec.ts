import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpenseworkingareaComponent } from './expenseworkingarea.component';

describe('ExpenseworkingareaComponent', () => {
  let component: ExpenseworkingareaComponent;
  let fixture: ComponentFixture<ExpenseworkingareaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExpenseworkingareaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpenseworkingareaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

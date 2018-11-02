import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchexpensesComponent } from './searchexpenses.component';

describe('SearchexpensesComponent', () => {
  let component: SearchexpensesComponent;
  let fixture: ComponentFixture<SearchexpensesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchexpensesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchexpensesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

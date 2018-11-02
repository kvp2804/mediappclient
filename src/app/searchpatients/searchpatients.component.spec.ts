import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchpatientsComponent } from './searchpatients.component';

describe('SearchpatientsComponent', () => {
  let component: SearchpatientsComponent;
  let fixture: ComponentFixture<SearchpatientsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchpatientsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchpatientsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

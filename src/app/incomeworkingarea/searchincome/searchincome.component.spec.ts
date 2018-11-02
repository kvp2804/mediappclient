import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchincomeComponent } from './searchincome.component';

describe('SearchincomeComponent', () => {
  let component: SearchincomeComponent;
  let fixture: ComponentFixture<SearchincomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchincomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchincomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

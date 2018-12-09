import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportworkingareaComponent } from './reportworkingarea.component';

describe('ReportworkingareaComponent', () => {
  let component: ReportworkingareaComponent;
  let fixture: ComponentFixture<ReportworkingareaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportworkingareaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportworkingareaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

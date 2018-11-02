import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkingareaComponent } from './workingarea.component';

describe('WorkingareaComponent', () => {
  let component: WorkingareaComponent;
  let fixture: ComponentFixture<WorkingareaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkingareaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkingareaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

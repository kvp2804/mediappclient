import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IncomeworkingareaComponent } from './incomeworkingarea.component';

describe('IncomeworkingareaComponent', () => {
  let component: IncomeworkingareaComponent;
  let fixture: ComponentFixture<IncomeworkingareaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IncomeworkingareaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IncomeworkingareaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

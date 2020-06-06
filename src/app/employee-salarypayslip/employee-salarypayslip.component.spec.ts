import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeSalarypayslipComponent } from './employee-salarypayslip.component';

describe('EmployeeSalarypayslipComponent', () => {
  let component: EmployeeSalarypayslipComponent;
  let fixture: ComponentFixture<EmployeeSalarypayslipComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployeeSalarypayslipComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeSalarypayslipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

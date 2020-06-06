import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeLeavedataComponent } from './employee-leavedata.component';

describe('EmployeeLeavedataComponent', () => {
  let component: EmployeeLeavedataComponent;
  let fixture: ComponentFixture<EmployeeLeavedataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployeeLeavedataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeLeavedataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

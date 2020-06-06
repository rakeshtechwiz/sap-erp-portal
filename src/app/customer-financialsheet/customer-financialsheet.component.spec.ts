import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerFinancialsheetComponent } from './customer-financialsheet.component';

describe('CustomerFinancialsheetComponent', () => {
  let component: CustomerFinancialsheetComponent;
  let fixture: ComponentFixture<CustomerFinancialsheetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerFinancialsheetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerFinancialsheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

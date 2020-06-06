import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorFinancialsheetComponent } from './vendor-financialsheet.component';

describe('VendorFinancialsheetComponent', () => {
  let component: VendorFinancialsheetComponent;
  let fixture: ComponentFixture<VendorFinancialsheetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VendorFinancialsheetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VendorFinancialsheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

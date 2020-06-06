import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SafetyDashboardComponent } from './safety-dashboard.component';

describe('SafetyDashboardComponent', () => {
  let component: SafetyDashboardComponent;
  let fixture: ComponentFixture<SafetyDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SafetyDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SafetyDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

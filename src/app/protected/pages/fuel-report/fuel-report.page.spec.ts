import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FuelReportPage } from './fuel-report.page';

describe('FuelReportPage', () => {
  let component: FuelReportPage;
  let fixture: ComponentFixture<FuelReportPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FuelReportPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FuelReportPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpeedReportPage } from './speed-report.page';

describe('SpeedReportPage', () => {
  let component: SpeedReportPage;
  let fixture: ComponentFixture<SpeedReportPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpeedReportPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpeedReportPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

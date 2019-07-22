import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleMapPage } from './vehicle-map.page';

describe('VehicleMapPage', () => {
  let component: VehicleMapPage;
  let fixture: ComponentFixture<VehicleMapPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VehicleMapPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VehicleMapPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

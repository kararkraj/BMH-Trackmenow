import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetMapPage } from './asset-map.page';

describe('AssetMapPage', () => {
  let component: AssetMapPage;
  let fixture: ComponentFixture<AssetMapPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssetMapPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetMapPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

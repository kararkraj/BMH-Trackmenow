import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TravelReplayPage } from './travel-replay.page';

describe('TravelReplayPage', () => {
  let component: TravelReplayPage;
  let fixture: ComponentFixture<TravelReplayPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TravelReplayPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TravelReplayPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

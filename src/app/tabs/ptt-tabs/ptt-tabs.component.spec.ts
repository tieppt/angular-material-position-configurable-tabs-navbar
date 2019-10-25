import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PttTabsComponent } from './ptt-tabs.component';

describe('PttTabsComponent', () => {
  let component: PttTabsComponent;
  let fixture: ComponentFixture<PttTabsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PttTabsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PttTabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScreeningIntroComponent } from './screening-intro.component';

describe('ScreeningComponent', () => {
  let component: ScreeningIntroComponent;
  let fixture: ComponentFixture<ScreeningIntroComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ScreeningIntroComponent]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScreeningIntroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

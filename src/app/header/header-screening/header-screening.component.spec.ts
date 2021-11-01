import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderScreeningComponent } from './header-screening.component';

describe('HeaderScreeningComponent', () => {
  let component: HeaderScreeningComponent;
  let fixture: ComponentFixture<HeaderScreeningComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HeaderScreeningComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderScreeningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

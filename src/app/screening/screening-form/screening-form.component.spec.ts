import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScreeningFormComponent } from './screening-form.component';

describe('ScreeningFormComponent', () => {
  let component: ScreeningFormComponent;
  let fixture: ComponentFixture<ScreeningFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScreeningFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScreeningFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

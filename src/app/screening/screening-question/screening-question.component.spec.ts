import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScreeningQuestionComponent } from './screening-question.component';

describe('SurveyComponent', () => {
  let component: ScreeningQuestionComponent;
  let fixture: ComponentFixture<ScreeningQuestionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ScreeningQuestionComponent]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScreeningQuestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

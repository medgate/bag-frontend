import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecommendationSummaryComponent } from './recommendation-summary.component';

describe('ScreeningResultComponent', () => {
  let component: RecommendationSummaryComponent;
  let fixture: ComponentFixture<RecommendationSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RecommendationSummaryComponent]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecommendationSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { Component, Input } from '@angular/core';
import { Severity } from '../severity.enum';
import { Recommendation } from '../recommendation.model';
import { TranslateService } from '@ngx-translate/core';
import { RedirectService } from '../../core/redirect/redirect.service';

@Component({
  selector: 'bag-recommendation-summary',
  templateUrl: './recommendation-summary.component.html',
  styleUrls: ['./recommendation-summary.component.scss']
})
export class RecommendationSummaryComponent {

  @Input() public recommendation: Recommendation;

  constructor(
    private readonly redirectService: RedirectService,
    private readonly translate: TranslateService
  ) {
  }

  public getSeverityClass(severity: Severity): string {
    switch (severity) {
      case Severity.HIGH:
        return 'severity-high';
      case Severity.MEDIUM:
        return 'severity-medium';
      case Severity.LOW:
        return 'severity-low';
      default:
        return 'severity-low';
    }
  }

  public redirectBagWebsite() {
    this.redirectService.redirectBagWebsite(this.translate.getDefaultLang());
  }
}

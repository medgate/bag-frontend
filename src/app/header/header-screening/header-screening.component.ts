import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { RedirectService } from '../../core/redirect/redirect.service';

@Component({
  selector: 'bag-header-screening',
  templateUrl: './header-screening.component.html',
  styleUrls: ['./header-screening.component.scss']
})
export class HeaderScreeningComponent {

  constructor(
    private readonly redirectService: RedirectService,
    private readonly translate: TranslateService
  ) {
  }

  public redirectBagWebsite() {
    this.redirectService.redirectBagWebsite(this.translate.getDefaultLang());
  }
}

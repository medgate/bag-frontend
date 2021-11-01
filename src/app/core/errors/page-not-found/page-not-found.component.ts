import { Component } from '@angular/core';
import { RedirectService } from '../../redirect/redirect.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'bag-page-not-found',
  templateUrl: './page-not-found.component.html',
  styleUrls: ['./page-not-found.component.scss']
})
export class PageNotFoundComponent {

  constructor(
    private readonly redirectService: RedirectService,
    private readonly translate: TranslateService
  ) {
  }

  public redirectBagWebsite() {
    this.redirectService.redirectBagWebsite(this.translate.getDefaultLang());
  }
}

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RedirectService {

  private BAG_LOCATION_FR = 'https://www.bag.admin.ch/nouveau-coronavirus';
  private BAG_LOCATION_DE = 'https://www.bag.admin.ch/neues-coronavirus';
  private BAG_LOCATION_EN = 'https://www.bag.admin.ch/novel-coronavirus';
  private BAG_LOCATION_IT = 'https://www.bag.admin.ch/nuovo-coronavirus';


  public redirectBagWebsite(languageSelected: string) {
    switch (languageSelected) {
      case 'fr': {
        window.open(this.BAG_LOCATION_FR, '_blank');
        break;
      }
      case 'en': {
        window.open(this.BAG_LOCATION_EN, '_blank');
        break;
      }
      case 'it': {
        window.open(this.BAG_LOCATION_IT, '_blank');
        break;
      }
      default: {
        window.open(this.BAG_LOCATION_DE, '_blank');
        break;
      }
    }
  }
}

import { BrowserModule } from '@angular/platform-browser';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ScreeningIntroComponent } from './screening/screening-intro/screening-intro.component';
import { ScreeningQuestionComponent } from './screening/screening-question/screening-question.component';
import { ProfileFormComponent } from './profile/profile-form/profile-form.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CoreModule } from './core/core.module';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { RecommendationSummaryComponent } from './recommendation/recommendation-summary/recommendation-summary.component';
import { HeaderIntroComponent } from './header/header-intro/header-intro.component';
import { HeaderScreeningComponent } from './header/header-screening/header-screening.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ScreeningFormComponent } from './screening/screening-form/screening-form.component';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { FooterComponent } from './footer/footer.component';
import { TranslateService } from '@ngx-translate/core';
import { SessionStorageService } from 'ngx-webstorage';
import { ALL_LANGUAGES, DEFAULT_LANGUAGE, Language, HOSTNAME_2_LANGUAGE } from './core/languages/language.enum';

export function initializeLanguage(translate: TranslateService, storage: SessionStorageService) {
  return () => {
    return new Promise((resolve) => {
      const appLanguage = storage.retrieve('profile')?.language
        || getLangFromUrl()
        || translate.getBrowserLang()
        || DEFAULT_LANGUAGE;
      const selectedLanguage = ALL_LANGUAGES.find(
        language => language === appLanguage.substr(0, 2)
      );
  
      translate.addLangs(ALL_LANGUAGES);
      translate.setDefaultLang(selectedLanguage || DEFAULT_LANGUAGE);
      resolve();
    });
  };
}

function getLangFromUrl(): string {
  const hostname = window.location.hostname;
  if (hostname in HOSTNAME_2_LANGUAGE) {
    return HOSTNAME_2_LANGUAGE[hostname];
  }
  return null;
}

@NgModule({
  declarations: [
    AppComponent,
    HeaderIntroComponent,
    HeaderScreeningComponent,
    ScreeningIntroComponent,
    ScreeningFormComponent,
    ProfileFormComponent,
    ScreeningQuestionComponent,
    RecommendationSummaryComponent,
    FooterComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CoreModule,
    MatRadioModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatMomentDateModule,
    MatExpansionModule,
    MatAutocompleteModule,
    MatToolbarModule,
    MatSelectModule,
    MatCheckboxModule,
    FormsModule,
    MatIconModule,
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: initializeLanguage,
      multi: true,
      deps: [TranslateService, SessionStorageService]
    },
    {
      provide: MAT_DATE_LOCALE,
      useValue: 'fr'
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}

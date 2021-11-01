import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Profile } from '../../profile/profile.model';
import { RedirectService } from '../../core/redirect/redirect.service';
import { FormControl, FormGroup } from '@angular/forms';
import { ProfileService } from '../../profile/profile.service';
import { ALL_LANGUAGES, Language } from '../../core/languages/language.enum';

@Component({
  selector: 'bag-header-intro',
  templateUrl: './header-intro.component.html',
  styleUrls: ['./header-intro.component.scss']
})
export class HeaderIntroComponent implements OnInit {

  public profile: Profile;
  public languageForm!: FormGroup;

  constructor(
    private readonly translate: TranslateService,
    private readonly profileService: ProfileService,
    private readonly redirectService: RedirectService
  ) {
  }

  public ngOnInit(): void {
    this.languageForm = new FormGroup({
      language: new FormControl(),
    });

    setTimeout(() => {
      this.initializeLanguageForm();
    }, 100);
  }

  private initializeLanguageForm() {
    const language = this.profileService.getCurrentProfile().language;
    this.languageForm.get('language').setValue(language);
    this.updateLanguage();
  }

  public updateLanguage(): void {
    let profile = this.profileService.getCurrentProfile();
    profile.language = this.getCurrentLanguage();
    this.profileService.changeProfile(profile);
  }

  private getFormLanguage(): string {
    return this.languageForm.get('language').value;
  }

  private getCurrentLanguage(): Language {
    const language = this.findAvailableLanguage(this.getFormLanguage());
    return language ? language : this.findAvailableLanguage(this.translate.getDefaultLang());
  }

  private findAvailableLanguage(language: string): Language {
    return ALL_LANGUAGES.find(lang => lang == language);
  }

  public redirectBagWebsite() {
    this.redirectService.redirectBagWebsite(this.getFormLanguage());
  }
}

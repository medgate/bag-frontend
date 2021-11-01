import { Injectable } from '@angular/core';
import { Profile } from './profile.model';
import { SessionStorageService } from 'ngx-webstorage';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  private currentProfile: Profile;
  public profileChanges = new Subject<Profile>();

  constructor(
    private readonly storage: SessionStorageService,
    private readonly translate: TranslateService
  ) {
    this.initializeProfile();
  }

  public initializeProfile(): void {
    const storedProfile = this.storage.retrieve('profile');
    this.currentProfile = this.buildProfile(storedProfile);
    if (!storedProfile) {
      this.storage.store('profile', this.currentProfile);
    }
  }

  private buildProfile(storedProfile?: any) {
    return {
      gender: storedProfile?.gender,
      age: storedProfile?.age,
      canton: storedProfile?.canton,
      language: storedProfile?.language || this.translate.getDefaultLang(),
      symptoms: storedProfile?.symptoms
    } as Profile;
  }

  public getCurrentProfile(): Profile {
    return this.currentProfile;
  }

  public changeProfile(profile: Profile): void {
    this.currentProfile = profile;
    this.storage.store('profile', profile);
    this.translate.setDefaultLang(profile.language);
    this.profileChanges.next(profile);
  }

  public resetProfile() {
    this.currentProfile = this.buildProfile();
    this.storage.store('profile', this.currentProfile);
    this.profileChanges.next(this.currentProfile);
  }
}

import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  Validators
} from '@angular/forms';
import { Profile } from '../profile.model';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { ALL_SWISS_CANTONS, Canton } from '../canton.model';
import { ProfileService } from '../profile.service';
import { Router } from '@angular/router';
import { Language } from '../../core/languages/language.enum';
import { Symptom } from '../symptom.enum';


@Component({
  selector: "bag-profile-form",
  templateUrl: "./profile-form.component.html",
  styleUrls: ["./profile-form.component.scss"],
})
export class ProfileFormComponent implements OnInit {
  public MAX_AGE_WITHOUT_SYMPTOMS_QUESTION = 11;
  public profileForm: FormGroup;
  public cantons: Canton[] = [];
  public filteredCantonOptions: Observable<Canton[]>;
  public isIEOrEdge = /msie\s|trident\/|edge\//i.test(
    window.navigator.userAgent
  );
  public loading: boolean = false;
  public profileStep = 0;

  public symptoms = Symptom;

  public getSymptoms() {
    return Object.keys(Symptom);
  }

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly profileService: ProfileService,
    private readonly router: Router
  ) {}

  public ngOnInit(): void {
    this.initializeProfile();
    this.sortCantonsByName();
    this.buildProfileForm();
    this.filterCantonAutoComplete();
  }

  onCheckChange(event) {
    const formArray: FormArray = this.profileForm.get("symptoms") as FormArray;

    if (event.checked) {
      formArray.push(new FormControl(event.source.value));
      if (
        event.source.value as Symptom === this.getSymptomKey(Symptom.NO_SYMPTOMS)
      ) {
        this.onlySelectNoSymptoms(formArray);
      } else {
        this.unselectNoSymptoms(formArray);
      }
    } else {
      this.clearSelectedSymptoms(event.source.value);
    }
  }

  private getSymptomKey(symptomName: string): Symptom {
    let allSymptoms = this.getSymptoms();
    for (let i = 0; i < allSymptoms.length; i++) {
      if (Symptom[allSymptoms[i]] == symptomName) {
        return allSymptoms[i] as Symptom;
      }
    }
  }

  private onlySelectNoSymptoms(formArray: FormArray) {
    formArray.clear();
    formArray.push(new FormControl(this.getSymptomKey(Symptom.NO_SYMPTOMS)));
    this.profileForm.patchValue({
      symptoms: [this.getSymptomKey(Symptom.NO_SYMPTOMS)],
    });
  }

  private unselectNoSymptoms(formArray: FormArray) {
    const symptomIds: Symptom[] = this.getSelectedSymptomIds();
    let noSymptomsIndex = symptomIds.indexOf(
      this.getSymptomKey(Symptom.NO_SYMPTOMS)
    );
    if (noSymptomsIndex > -1) {
      symptomIds.splice(noSymptomsIndex, 1);
    }
    formArray.clear();
    symptomIds.forEach((symptomId) =>
      formArray.push(new FormControl(symptomId))
    );
    this.profileForm.patchValue({ symptoms: symptomIds });
  }

  private getSelectedSymptomIds(): Symptom[] {
    const formArray = this.profileForm.get("symptoms") as FormArray;
    return formArray.getRawValue();
  }

  public isChecked(symptomId: Symptom) {
    return this.getSelectedSymptomIds().indexOf(symptomId) > 0;
  }

  private clearSelectedSymptoms(symptom: Symptom) {
    let i: number = 0;
    let formArray = this.profileForm.get("symptoms") as FormArray;

    formArray.controls.forEach((ctrl: FormControl) => {
      if (ctrl.value as Symptom == symptom) {
        formArray.removeAt(i);
        return;
      }

      i++;
    });
  }

  private initializeProfile() {
    this.profileService.resetProfile();
    this.profileService.profileChanges.subscribe((profile: Profile) => {
      this.sortCantonsByName();
      const selectedCanton = this.cantons.find(
        (canton) => canton.id === this.profileForm.get("canton").value?.id
      );
      this.profileForm.patchValue({ canton: selectedCanton });
    });
  }

  private buildProfileForm() {
    this.profileForm = this.formBuilder.group({
      age: ["", [Validators.required, Validators.min(0), Validators.max(120)]],
      gender: ["", Validators.required],
      canton: ["", Validators.required],
      symptoms: new FormArray([], Validators.required),
    });

    this.profileForm.get("canton").setValidators([
      (control: AbstractControl): ValidationErrors | null => {
        const exists = ALL_SWISS_CANTONS.find(
          (canton) => canton.id === control.value?.id
        );
        return !exists ? { invalid: true } : null;
      },
    ]);
  }

  public checkAgeMaxLength(): boolean {
    return String(this.profileForm.get("age").value).length !== 3;
  }

  private sortCantonsByName(): void {
    this.cantons = ALL_SWISS_CANTONS.map((canton) =>
      this.toCanton(canton)
    ).sort((canton1: Canton, canton2: Canton) => {
      const name1 = this.removeAccents(canton1.name);
      const name2 = this.removeAccents(canton2.name);
      if (name1 > name2) {
        return 1;
      }
      if (name1 < name2) {
        return -1;
      }
      return 0;
    });
  }

  private toCanton(canton: any): Canton {
    return {
      id: canton.id,
      name: canton.name[this.getCurrentLanguage()],
    } as Canton;
  }

  public getCurrentLanguage(): Language {
    return this.profileService.getCurrentProfile().language;
  }

  public filterCantonAutoComplete() {
    this.filteredCantonOptions = this.profileForm
      .get("canton")
      .valueChanges.pipe(
        startWith(""),
        map((value) => (typeof value === "string" ? value : value?.name)),
        map((value) => this.filterCantons(value))
      );
  }

  private filterCantons(userInput: string): Canton[] {
    if (!userInput) {
      return this.cantons;
    }
    const partialName = this.removeAccents(userInput);
    return this.cantons.filter((canton) =>
      this.removeAccents(canton.name).startsWith(partialName)
    );
  }

  public displayCanton(canton?: Canton): string | undefined {
    return canton ? canton.name : undefined;
  }

  private removeAccents(value: string): string {
    const accents =
      "ÀÁÂÃÄÅàáâãäåÒÓÔÕÕÖØòóôõöøÈÉÊËèéêëðÇçÐÌÍÎÏìíîïÙÚÛÜùúûüÑñŠšŸÿýŽž";
    const accentsOut =
      "AAAAAAaaaaaaOOOOOOOooooooEEEEeeeeeCcDIIIIiiiiUUUUuuuuNnSsYyyZz";
    const str = value.split("");
    const strLen = str.length;
    for (let i = 0; i < strLen; i++) {
      let x = accents.indexOf(str[i]);
      if (x !== -1) {
        str[i] = accentsOut[x];
      }
    }
    return str.join("").toLowerCase();
  }

  public isNextDisabled() {
    if (this.profileStep === 0) {
      return (
        !this.profileForm.get("gender").valid ||
        !this.profileForm.get("age").valid ||
        !this.profileForm.get("canton").valid
      );
    } else {
      return !this.profileForm.valid || this.loading;
    }
  }

  public goBack() {
    this.profileStep--;
    if (this.profileStep < 0) {
      this.router.navigateByUrl("/");
    }
  }

  public goNext() {
    window.scroll(0, 0);
    this.profileStep++;
    if (this.profileStep > 1 || this.profileForm.get("age").value <= this.MAX_AGE_WITHOUT_SYMPTOMS_QUESTION) {
      this.submitForm();
    }
  }

  private submitForm() {
    this.loading = true;
    this.profileService.changeProfile(this.buildProfile());
    this.router.navigateByUrl("/screening/questions");
  }

  private buildProfile(): Profile {
    const formValue = this.profileForm.value;
    return {
      gender: formValue.gender,
      age: formValue.age,
      canton: formValue.canton.id,
      language: this.getCurrentLanguage(),
      symptoms: formValue.symptoms,
    } as Profile;
  }
}

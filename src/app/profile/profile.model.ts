import { Gender } from './gender.enum';
import { Language } from '../core/languages/language.enum';
import { Symptom } from './symptom.enum';

export class Profile {
  gender: Gender;
  age: number;
  canton: string;
  language: Language;
  symptoms: Symptom[];
}

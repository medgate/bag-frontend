import { Severity } from './severity.enum';

export class Recommendation {
  public id: string;
  public title: string;
  public description: string;
  public medgateTitle: string;
  public medgateDescription: string;
  public severity: Severity;
}

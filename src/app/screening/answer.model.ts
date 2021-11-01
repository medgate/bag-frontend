import { AnswerType } from './answer-type.enum';
import { Recommendation } from '../recommendation/recommendation.model';

export class Answer {
  public id: string;
  public type: AnswerType;
  public text: string;
  public nextNodeId: string;
  public recommendation: Recommendation;
}

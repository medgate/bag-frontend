import { Answer } from './answer.model';

export class QuestionNode {
  public questionId: string;
  public question: string;
  public description: string;
  public answers: Answer[];
}

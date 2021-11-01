import { Recommendation } from '../recommendation/recommendation.model';
import { QuestionNode } from './question-node.model';

export class InitialQuestion {
  public version: string;
  public initialNodeId: string;
  public node: QuestionNode;
  public recommendation?: Recommendation;
}

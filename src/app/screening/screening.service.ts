import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { InitialQuestion } from './initial-question.model';
import { Observable } from 'rxjs';
import { Profile } from '../profile/profile.model';
import { QuestionNode } from './question-node.model';
import { Recommendation } from '../recommendation/recommendation.model';
import { Exchange } from './exchange.model';

@Injectable({
  providedIn: 'root'
})
export class ScreeningService {

  private resource = `${environment.apiBasePath}/screening/answers`;

  constructor(private http: HttpClient) {
  }

  public postProfileForInitialQuestion(profile: Profile): Observable<InitialQuestion> {
    return this.http.post<InitialQuestion>(`${this.resource}/first`, profile);
  }

  public postUserAnswer(
    profile: Profile, version: string, nodeIds: string[]
  ): Observable<QuestionNode> {
    return this.http.post<QuestionNode>(this.resource, {
      version: version,
      profile: profile,
      nodeIds: nodeIds
    });
  }

  public postCompletedScreeningAnswers(
    profile: Profile, version: string, exchanges: Exchange[], recommendation: Recommendation
  ): Observable<QuestionNode> {
    return this.http.post<QuestionNode>(`${this.resource}/completed`, {
      version: version,
      profile: profile,
      exchanges: exchanges,
      recommendationId: recommendation.id
    });
  }
}

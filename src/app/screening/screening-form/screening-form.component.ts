import { Component, OnInit } from '@angular/core';
import { Profile } from '../../profile/profile.model';
import { QuestionNode } from '../question-node.model';
import { InitialQuestion } from '../initial-question.model';
import { ScreeningService } from '../screening.service';
import { FormBuilder } from '@angular/forms';
import { Answer } from '../answer.model';
import { AnswerType } from '../answer-type.enum';
import { Recommendation } from '../../recommendation/recommendation.model';
import { Exchange } from '../exchange.model';
import { ProfileService } from '../../profile/profile.service';
import { Router } from '@angular/router';

@Component({
  selector: 'bag-screening-form',
  templateUrl: './screening-form.component.html',
  styleUrls: ['./screening-form.component.scss']
})
export class ScreeningFormComponent implements OnInit {

  public profile: Profile;
  public questionNode: QuestionNode;
  public recommendation: Recommendation;

  private version: string;
  private nodeIds: string[] = [];
  private exchanges: Exchange[] = [];
  public loading: boolean = false;
  public error: any = null;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly screeningService: ScreeningService,
    private readonly profileService: ProfileService,
    private readonly router: Router
  ) {
  }

  public ngOnInit(): void {
    this.profile = this.profileService.getCurrentProfile();
    if (this.isValidProfile()) {
      this.loadFirstQuestion(this.profile);
    } else {
      this.router.navigateByUrl('/screening')
    }
  }

  private isValidProfile(): boolean {
    return this.profile
      && !!this.profile.gender
      && !!this.profile.canton
      && this.profile.age >= 0 && this.profile.age <= 120;
  }

  private loadFirstQuestion(profile: Profile): void {
    this.loading = true;
    this.screeningService.postProfileForInitialQuestion(profile).subscribe(
      (response: InitialQuestion) => {
        if (response.recommendation) {
          this.recommendation = response.recommendation;
          this.questionNode = undefined;
          this.profileService.resetProfile();
        } else {
          this.version = response.version;
          this.questionNode = response.node;
          this.nodeIds.push(response.initialNodeId);
        }
        this.error = null;
        this.loading = false;
      },
      error => {
        this.error = error;
        this.loading = false;
      });
  }

  public submitAnswer(answer: Answer): void {
    if (answer) {
      if (this.hasRecommendation(answer)) {
        this.submitCompletedScreeningAnswers(answer);
      } else {
        this.submitUserAnswerAndShowNextQuestion(answer);
      }
    }
  }

  private hasRecommendation(answer: Answer): boolean {
    return AnswerType.RECOMMENDATION === answer.type
      && !!answer.recommendation;
  }

  public goBack(event: boolean): void {
    if (this.exchanges.length === 0) {
      this.router.navigateByUrl('/screening/profile')
    } else if (this.exchanges.length == 1) {
      this.nodeIds = [];
      this.exchanges = [];
      this.loadFirstQuestion(this.profile);
    } else {
      this.exchanges.pop();
      this.nodeIds.pop();
      this.loading = true;
      this.screeningService.postUserAnswer(this.profile, this.version, this.nodeIds)
      .subscribe((node: QuestionNode) => {
          this.questionNode = node;
          this.error = null;
          this.loading = false;
        },
        error => {
          this.error = error;
          this.loading = false;
        });
    }
  }

  private submitUserAnswerAndShowNextQuestion(answer: Answer) {
    this.loading = true;
    this.pushExchange(answer);
    this.nodeIds.push(answer.nextNodeId);
    this.screeningService.postUserAnswer(this.profile, this.version, this.nodeIds)
    .subscribe((node: QuestionNode) => {
        this.questionNode = node;
        this.error = null;
        this.loading = false;
      },
      error => {
        this.error = error;
        this.nodeIds.pop();
        this.exchanges.pop();
        this.loading = false;
      });
  }

  private submitCompletedScreeningAnswers(answer: Answer) {
    this.loading = true;
    this.pushExchange(answer);
    return this.screeningService.postCompletedScreeningAnswers(
      this.profile, this.version, this.exchanges, answer.recommendation)
    .subscribe((response: any) => {
        this.recommendation = answer.recommendation;
        this.questionNode = undefined;
        this.profileService.resetProfile();
        this.error = null;
        this.loading = false;
      },
      error => {
        this.error = error;
        this.exchanges.pop();
        this.loading = false;
      });
  }

  private pushExchange(answer: Answer) {
    this.exchanges.push({
      questionId: this.questionNode.questionId,
      answerId: answer.id
    });
  }
}

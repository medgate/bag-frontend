import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { QuestionNode } from '../question-node.model';
import { Answer } from '../answer.model';

@Component({
  selector: 'bag-screening-question',
  templateUrl: './screening-question.component.html',
  styleUrls: ['./screening-question.component.scss']
})
export class ScreeningQuestionComponent implements OnInit, AfterViewInit {

  @Input() public questionNode: QuestionNode;
  @Input() public loading: boolean;
  @Output() public userAnswer = new EventEmitter<Answer>();
  @Output() public goBack = new EventEmitter<boolean>();

  public questionForm: FormGroup;

  constructor(
    private readonly formBuilder: FormBuilder
  ) {
  }

  public ngOnInit(): void {
    this.questionForm = this.buildForm();
  }

  public ngAfterViewInit() {
    this.scrollToTop();
  }

  private buildForm() {
    return this.formBuilder.group({
      answer: ['', Validators.required]
    });
  }

  public submitForm() {
    const answer = this.questionForm.get('answer').value;
    this.userAnswer.emit(answer);
    this.questionForm.reset('answer');
    this.scrollToTop();
  }

  public goBackButton() {
    this.goBack.emit(true);
  }

  private scrollToTop() {
    window.scrollTo(0, 0);
  }

}

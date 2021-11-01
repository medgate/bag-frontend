import { Component, Input } from '@angular/core';

@Component({
  selector: 'bag-unexpected-error',
  templateUrl: './unexpected-error.component.html',
  styleUrls: ['./unexpected-error.component.scss']
})
export class UnexpectedErrorComponent {
  @Input() public error;
}

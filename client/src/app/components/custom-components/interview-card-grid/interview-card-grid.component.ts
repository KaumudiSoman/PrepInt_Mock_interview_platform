import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Interview } from 'src/app/_models/InterviewModel';
import { User } from 'src/app/_models/UserModel';
import { AuthService } from 'src/app/_services/auth.service';

@Component({
  selector: 'app-interview-card-grid',
  templateUrl: './interview-card-grid.component.html',
  styleUrls: ['./interview-card-grid.component.css']
})
export class InterviewCardGridComponent {
  @Input() title!: string;
  @Input() interviews: Interview[] = [];
  @Input() user: boolean = false;

  @Output() startInterview = new EventEmitter<string>();
  @Output() thumbsUp = new EventEmitter<any>();
  @Output() thumbsDown = new EventEmitter<any>();
  @Output() favorite = new EventEmitter<any>();
  @Output() delete = new EventEmitter<string>();
  @Output() onCreate = new EventEmitter<void>();

  loggedInUser: User = {} as User;

  constructor(private authService: AuthService) {
    this.loggedInUser = this.authService.getCurrentUser();
  }

  toCamelCase(text: string): string {
    return text
      .toLowerCase()
      .replace(/(?:^|\s)\w/g, match => match.toUpperCase());
  };

  formatTechStack(techstack: string[]): string {
  if (!techstack || techstack.length === 0) return '';

    return techstack
      .map(item => {
        if (!item) return '';
        return item.charAt(0).toUpperCase() + item.slice(1).toLowerCase();
      })
      .join(', ');
  }
}

import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Interview } from 'src/app/_models/InterviewModel';
import { User } from 'src/app/_models/UserModel';
import { AuthService } from 'src/app/_services/auth.service';
import { UtilService } from 'src/app/_services/util.service';

@Component({
  selector: 'app-interview-card-grid',
  templateUrl: './interview-card-grid.component.html',
  styleUrls: ['./interview-card-grid.component.css']
})
export class InterviewCardGridComponent {
  @Input() title!: string;
  @Input() interviews: Interview[] = [];
  @Input() user: boolean = false;
  popup: boolean = false;

  @Output() startInterview = new EventEmitter<string>();
  @Output() thumbsUp = new EventEmitter<any>();
  @Output() thumbsDown = new EventEmitter<any>();
  @Output() favorite = new EventEmitter<any>();
  // @Output() delete = new EventEmitter<string>();
  @Output() onCreate = new EventEmitter<void>();
  @Output() requestDelete = new EventEmitter<string>();

  loggedInUser: User = {} as User;

  constructor(
    private authService: AuthService,
    private utilService: UtilService
  ) {
    this.loggedInUser = this.authService.getCurrentUser();
  }

  toCamelCase(text: string): string {
    return this.utilService.toCamelCase(text);
  };

  formatTechStack(techstack: string[]): string {
    return this.utilService.formatTechStack(techstack);
  }

  openPopup(interviewId: string) {
    // this.popup = true;
    this.requestDelete.emit(interviewId);
  }
}

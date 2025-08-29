import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Interview } from 'src/app/_models/InterviewModel';
import { Note } from 'src/app/_models/noteModel';
import { User } from 'src/app/_models/UserModel';
import { AuthService } from 'src/app/_services/auth.service';
import { UtilService } from 'src/app/_services/util.service';

@Component({
  selector: 'app-interview-card-grid',
  templateUrl: './interview-card-grid.component.html',
  styleUrls: ['./interview-card-grid.component.css']
})
export class InterviewCardGridComponent implements OnInit {
  @Input() title!: string;
  @Input() data: (Interview | Note)[] = [];
  @Input() user: boolean = false;
  @Input() cardType!: string;
  popup: boolean = false;
  buttonTitle!: string;

  @Output() start = new EventEmitter<string>();
  @Output() thumbsUp = new EventEmitter<any>();
  @Output() thumbsDown = new EventEmitter<any>();
  @Output() favorite = new EventEmitter<any>();
  @Output() onCreate = new EventEmitter<void>();
  @Output() requestDelete = new EventEmitter<string>();

  loggedInUser: User = {} as User;

  constructor(
    private authService: AuthService,
    private utilService: UtilService
  ) {
    this.loggedInUser = this.authService.getCurrentUser();
  }

  ngOnInit() {
    if (this.cardType) {
      this.buttonTitle = (this.toCamelCase(this.cardType) === 'Interview') ? 'Start' : 'Details';
    }
  }

  toCamelCase(text: string): string {
    return this.utilService.toCamelCase(text);
  };

  formatTechStack(techstack: string[]): string {
    return this.utilService.formatTechStack(techstack);
  }

  openPopup(interviewId: string) {
    this.requestDelete.emit(interviewId);
  }
}

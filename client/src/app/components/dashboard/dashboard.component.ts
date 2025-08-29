import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Interview } from 'src/app/_models/InterviewModel';
import { User } from 'src/app/_models/UserModel';
import { AttemptsService } from 'src/app/_services/attempts.service';
import { InterviewActionsService } from 'src/app/_services/interview-actions.service';
import { InterviewService } from 'src/app/_services/interview.service';
import { UserInteracationService } from 'src/app/_services/user-interacation.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  allInterviews: Interview[] = [];
  userInterviews: Interview[] = [];
  loggedInUser: User = {} as User;
  popupInterviewId: string | null = null;

  constructor(
    private interviewService: InterviewService,
    private toastrService: ToastrService,
    private interviewActionsService: InterviewActionsService,
    private attemptsService: AttemptsService,
    private route: Router
  ) { }

  ngOnInit(): void {
    this.getAllInterviews();
    this.getUserInterviews();
  }

  getAllInterviews() {
    this.interviewService.getAllInterviews().subscribe({
      next: (response: any) => {
        this.allInterviews = response.data;
        this.allInterviews.forEach(interview => {
          this.interviewActionsService.getInterviewInteraction(interview);
          this.getAttempts(interview);
        });
      },
      error: error => {
        this.toastrService.error(error.error?.error || error.message);
      }
    })
  };

  getUserInterviews() {
    this.interviewService.getUserInterviews().subscribe({
      next: (response: any) => {
        this.userInterviews = response.data;
        this.userInterviews.forEach(interview => {
          this.interviewActionsService.getInterviewInteraction(interview);
          this.getAttempts(interview);
        });
      },
      error: error => {
        this.toastrService.error(error.error?.error || error.message);
      }
    })
  };

  startInterview(interviewId: string) {
    this.interviewActionsService.startInterview(interviewId);
  };

  toggleThumbsUp(interview: Interview) {
    this.interviewActionsService.toggleThumbsUp(interview).subscribe({
      next: () => {
        this.getAllInterviews();
        this.getUserInterviews();
      },
      error: error => {
        this.toastrService.error(error.error?.error || error.message);
      }
    });
  }

  toggleThumbsDown(interview: Interview) {
    this.interviewActionsService.toggleThumbsDown(interview).subscribe({
      next: () => {
        this.getAllInterviews();
        this.getUserInterviews();
      },
      error: error => {
        this.toastrService.error(error.error?.error || error.message);
      }
    });
  }

  toggleFavorite(interview: Interview) {
    this.interviewActionsService.toggleFavorite(interview).subscribe({
      next: () => {
        this.getAllInterviews();
        this.getUserInterviews();
      },
      error: error => {
        this.toastrService.error(error.error?.error || error.message);
      }
    });
  }

  deleteInterview() {
    if(this.popupInterviewId) {
      this.interviewActionsService.deleteInterview(this.popupInterviewId).subscribe({
        next: (response: any) => {
          this.toastrService.success(response.message);
          this.getAllInterviews();
          this.getUserInterviews();
        },
        error: err => this.toastrService.error(err.message)
      });
    }
    this.popupInterviewId = null;
  };

  onCreate() {
    this.route.navigateByUrl('create-interview');
  };

  getAttempts(interview: Interview) {
    this.attemptsService.getAttemptsCount(interview._id).subscribe({
      next: (response: any) => {
        interview.attempts = response.data;
      },
      error: error => {
        this.toastrService.error(error.error?.error || error.message);
      }
    });
  };

  onRequestDelete(interviewId: string) {
    this.popupInterviewId = interviewId;
  };

  closePopup() {
    this.popupInterviewId = null;
  }
}

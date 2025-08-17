import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Interview } from 'src/app/_models/InterviewModel';
import { AttemptsService } from 'src/app/_services/attempts.service';
import { InterviewActionsService } from 'src/app/_services/interview-actions.service';
import { InterviewService } from 'src/app/_services/interview.service';

@Component({
  selector: 'app-favorite-interviews',
  templateUrl: './favorite-interviews.component.html',
  styleUrls: ['./favorite-interviews.component.css']
})
export class FavoriteInterviewsComponent implements OnInit {
  favoriteInterviews: Interview[] = [];
  popupInterviewId: string | null = null;

  constructor(
    private interviewService: InterviewService,
    private toastrService: ToastrService,
    private interviewActionsService: InterviewActionsService,
    private attemptsService: AttemptsService,
  ) { }

  ngOnInit(): void {
    this.getFavoriteInterviews();
  }

  getFavoriteInterviews() {
    this.interviewService.getFavoriteInterviews().subscribe({
      next: (response: any) => {
        this.favoriteInterviews = response.data;
        this.favoriteInterviews.forEach(interview => {
          this.interviewActionsService.getUserInteraction(interview);
          this.getAttempts(interview);
        });
      },
      error: err => {
        this.toastrService.error(err.message);
      }
    });
  }

  startInterview(interviewId: string) {
    this.interviewActionsService.startInterview(interviewId);
  };

  toggleThumbsUp(interview: Interview) {
    this.interviewActionsService.toggleThumbsUp(interview).subscribe({
      next: () => {
        this.getFavoriteInterviews();
      },
      error: error => {
        this.toastrService.error(error.message);
      }
    });
  }

  toggleThumbsDown(interview: Interview) {
    this.interviewActionsService.toggleThumbsDown(interview).subscribe({
      next: () => {
        this.getFavoriteInterviews();
      },
      error: error => {
        this.toastrService.error(error.message);
      }
    });
  }

  toggleFavorite(interview: Interview) {
    this.interviewActionsService.toggleFavorite(interview).subscribe({
      next: () => {
        this.getFavoriteInterviews();
      },
      error: error => {
        this.toastrService.error(error.message);
      }
    });
  }

  deleteInterview() {
    if(this.popupInterviewId) {
      this.interviewActionsService.deleteInterview(this.popupInterviewId).subscribe({
        next: (response: any) => {
          this.toastrService.success(response.message);
          this.getFavoriteInterviews();
        },
        error: err => this.toastrService.error(err.message)
      });
    }
    this.popupInterviewId = null;
  }

  getAttempts(interview: Interview) {
    this.attemptsService.getAttemptsCount(interview._id).subscribe({
      next: (response: any) => {
        interview.attempts = response.data;
      },
      error: error => {
        this.toastrService.error(error.message);
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

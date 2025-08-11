import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Interview } from 'src/app/_models/InterviewModel';
import { InterviewActionsService } from 'src/app/_services/interview-actions.service';
import { InterviewService } from 'src/app/_services/interview.service';

@Component({
  selector: 'app-favorite-interviews',
  templateUrl: './favorite-interviews.component.html',
  styleUrls: ['./favorite-interviews.component.css']
})
export class FavoriteInterviewsComponent implements OnInit {
  favoriteInterviews: Interview[] = [];

  constructor(
    private interviewService: InterviewService,
    private toastrService: ToastrService,
    private interviewActionsService: InterviewActionsService
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

  deleteInterview(interviewId: string) {
    this.interviewActionsService.deleteInterview(interviewId).subscribe({
      next: (response: any) => {
        this.toastrService.success(response.message);
        this.getFavoriteInterviews();
      },
      error: err => this.toastrService.error(err.message)
    });
  }
}

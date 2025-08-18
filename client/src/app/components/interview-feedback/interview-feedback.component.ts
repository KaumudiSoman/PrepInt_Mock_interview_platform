import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Feedback } from 'src/app/_models/InterviewFeedbackModel';
import { Interview } from 'src/app/_models/InterviewModel';
import { User } from 'src/app/_models/UserModel';
import { AttemptsService } from 'src/app/_services/attempts.service';
import { AuthService } from 'src/app/_services/auth.service';
import { InterviewFeedbackService } from 'src/app/_services/interview-feedback.service';
import { InterviewService } from 'src/app/_services/interview.service';
import { UtilService } from 'src/app/_services/util.service';

@Component({
  selector: 'app-interview-feedback',
  templateUrl: './interview-feedback.component.html',
  styleUrls: ['./interview-feedback.component.css']
})
export class InterviewFeedbackComponent implements OnInit{
  loggedInUser: User = {} as User;
  feedback: Feedback | null = null;
  interview: Interview | null = null;
  attemptNumber: number = 1;

  constructor(
    private feedbackService: InterviewFeedbackService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private toastrService: ToastrService,
    private interviewService: InterviewService,
    private attemptsService: AttemptsService,
    private utilService: UtilService
  ) {
    this.loggedInUser = this.authService.getCurrentUser();
  }

  ngOnInit(): void {
    this.getFeedbackById(this.route.snapshot.paramMap.get('id')!);
  }

  getFeedbackById(feedbackId: string) {
    this.feedbackService.getFeedbackById(feedbackId).subscribe({
      next: (response: any) => {
        this.feedback = response.data;
        this.getInterview(this.feedback?.interviewId!);
        this.getAttemptNumber(this.feedback?.interviewId!, this.feedback?.attemptId!);
      },
      error: error => {
        this.toastrService.error(error.error?.error || error.message);
      }
    });
  }

  getInterview(interviewId: string) {
    this.interviewService.getInterviewById(interviewId).subscribe({
      next: (response: any) => {
        this.interview = response.data;
      },
      error: error => {
        this.toastrService.error(error.error?.error || error.message);
      }
    });
  }

  getAttemptNumber(interviewId: string, attempId: string) {
    this.attemptsService.getAttemptNumber(interviewId, attempId).subscribe({
      next: (response: any) => {
        this.attemptNumber = response.data;
      },
      error: error => {
        this.toastrService.error(error.error?.error || error.message);
      }
    });
  }

  toCamelCase(text: string) {
    return this.utilService.toCamelCase(text);
  }

  formatTechStack(techstack: string[]) {
    return this.utilService.formatTechStack(techstack);
  }
};

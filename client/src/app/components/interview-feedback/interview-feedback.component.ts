import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Feedback } from 'src/app/_models/InterviewFeedbackModel';
import { User } from 'src/app/_models/UserModel';
import { AuthService } from 'src/app/_services/auth.service';
import { InterviewFeedbackService } from 'src/app/_services/interview-feedback.service';
import { UtilService } from 'src/app/_services/util.service';

@Component({
  selector: 'app-interview-feedback',
  templateUrl: './interview-feedback.component.html',
  styleUrls: ['./interview-feedback.component.css']
})
export class InterviewFeedbackComponent implements OnInit{
  loggedInUser: User = {} as User;
  feedback: Feedback | null = null;

  constructor(
    private feedbackService: InterviewFeedbackService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private toastrService: ToastrService
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
      },
      error: error => {
        this.toastrService.error(error.message);
      }
    });
  } 
};

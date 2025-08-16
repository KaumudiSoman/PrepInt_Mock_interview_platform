import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Feedback } from 'src/app/_models/InterviewFeedbackModel';
import { InterviewFeedbackService } from 'src/app/_services/interview-feedback.service';
import { InterviewService } from 'src/app/_services/interview.service';
import { UtilService } from 'src/app/_services/util.service';

@Component({
  selector: 'app-feedbacks',
  templateUrl: './feedbacks.component.html',
  styleUrls: ['./feedbacks.component.css']
})
export class FeedbacksComponent implements OnInit {
  feedbacks: Feedback[] = [];

  constructor(
    private feedbackService: InterviewFeedbackService,
    private interviewService: InterviewService,
    private utilService: UtilService,
    private toastrService: ToastrService
  ) { }

  ngOnInit(): void {
      this.getAllFeedbacks();
  }

  getAllFeedbacks() {
    this.feedbackService.getAllFeedbacks().subscribe({
      next: (response: any) => {
        this.feedbacks = response.data;
        this.feedbacks.forEach(feedback => {
          this.interviewService.getInterviewById(feedback.interviewId).subscribe({
            next: (response: any) => {
              feedback.interview = response.data;
            },
            error: error => {
              this.toastrService.error(error.message);
            }
          });
        });
      },
      error: error => {
        this.toastrService.error(error.message);
      }
    });
  }

  toCamelCase(text: string) {
    return this.utilService.toCamelCase(text);
  }
}

import { Injectable } from '@angular/core';
import { InterviewService } from './interview.service';
import { UserInteracationService } from './user-interacation.service';
import { Interview } from '../_models/InterviewModel';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class InterviewActionsService {

  constructor(
    private interviewService: InterviewService,
    private userInteractionService: UserInteracationService,
    private toastrService: ToastrService,
    private route: Router
  ) { }

  getUserInteraction(interview: Interview) {
    this.userInteractionService.getUserInteraction(interview._id).subscribe({
      next: (response: any) => {
        if(response.data) {
          interview.isFavorite = response.data.isFavorite || false;
          if(response.data.voteType === 'upvote') {
            interview.isThumbsUp = true;
            interview.isThumbsDown = false;
          }
          else if (response.data.voteType === 'downvote') {
            interview.isThumbsUp = false;
            interview.isThumbsDown = true;
          } 
          else {
            interview.isThumbsUp = false;
            interview.isThumbsDown = false;
          }
        }
      },
      error: error => {
        this.toastrService.error(error.error?.error || error.message);
      }
    });
  };

  deleteInterview(interviewId: string) {
    return this.interviewService.deleteInterview(interviewId);
  };

  startInterview(interviewId: string) {
    this.route.navigateByUrl(`start-interview/${interviewId}`);
  };

  toggleFavorite(interview: Interview) {
    interview.isFavorite = !interview.isFavorite;
    let inputbody = {
      isFavorite: interview.isFavorite
    }
    return this.updateUserInteraction(interview._id, inputbody);
  };

  toggleThumbsUp(interview: Interview) {
    let voteType: 'upvote' | 'downvote' | null = null;

    if (interview.isThumbsUp) {
      interview.isThumbsUp = false;
      voteType = null;
    }
    else {
      interview.isThumbsUp = true;
      voteType = 'upvote';

      if (interview.isThumbsDown) {
        interview.isThumbsDown = false;
      }
    }
    return this.updateUserInteraction(interview._id, {voteType});
  }

  toggleThumbsDown(interview: Interview) {
    let voteType: 'upvote' | 'downvote' | null = null;

    if (interview.isThumbsDown) {
      interview.isThumbsDown = false;
      voteType = null;
    }
    else {
      interview.isThumbsDown = true;
      voteType = 'downvote';

      if (interview.isThumbsUp) {
        interview.isThumbsUp = false;
      }
    }
    return this.updateUserInteraction(interview._id, {voteType});
  };

  updateUserInteraction(interviewId: string, inputbody: any) {
    return this.userInteractionService.updateUserInteraction(interviewId, inputbody);
  }
}

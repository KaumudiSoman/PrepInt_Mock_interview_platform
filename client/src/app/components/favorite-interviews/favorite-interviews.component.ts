import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Interview } from 'src/app/_models/InterviewModel';
import { Note } from 'src/app/_models/noteModel';
import { AttemptsService } from 'src/app/_services/attempts.service';
import { InterviewActionsService } from 'src/app/_services/interview-actions.service';
import { InterviewService } from 'src/app/_services/interview.service';
import { NoteActionsService } from 'src/app/_services/note-actions.service';
import { NoteService } from 'src/app/_services/note.service';

@Component({
  selector: 'app-favorite-interviews',
  templateUrl: './favorite-interviews.component.html',
  styleUrls: ['./favorite-interviews.component.css']
})
export class FavoriteInterviewsComponent implements OnInit {
  favoriteInterviews: Interview[] = [];
  popupInterviewId: string | null = null;
  favoriteNotes: Note[] = [];
  popupNoteId: string | null = null;

  constructor(
    private interviewService: InterviewService,
    private noteService: NoteService,
    private toastrService: ToastrService,
    private interviewActionsService: InterviewActionsService,
    private noteActionsService: NoteActionsService,
    private attemptsService: AttemptsService,
  ) { }

  ngOnInit(): void {
    this.getFavoriteInterviews();
    this.getFavoriteNotes();
  }

  getFavoriteInterviews() {
    this.interviewService.getFavoriteInterviews().subscribe({
      next: (response: any) => {
        this.favoriteInterviews = response.data;
        this.favoriteInterviews.forEach(interview => {
          this.interviewActionsService.getInterviewInteraction(interview);
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

  toggleInterviewThumbsUp(interview: Interview) {
    this.interviewActionsService.toggleThumbsUp(interview).subscribe({
      next: () => {
        this.getFavoriteInterviews();
      },
      error: error => {
        this.toastrService.error(error.error?.error || error.message);
      }
    });
  }

  toggleInterviewThumbsDown(interview: Interview) {
    this.interviewActionsService.toggleThumbsDown(interview).subscribe({
      next: () => {
        this.getFavoriteInterviews();
      },
      error: error => {
        this.toastrService.error(error.error?.error || error.message);
      }
    });
  }

  toggleInterviewFavorite(interview: Interview) {
    this.interviewActionsService.toggleFavorite(interview).subscribe({
      next: () => {
        this.getFavoriteInterviews();
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
        this.toastrService.error(error.error?.error || error.message);
      }
    });
  };

  onInterviewRequestDelete(interviewId: string) {
    this.popupInterviewId = interviewId;
  };

  closeInterviewPopup() {
    this.popupInterviewId = null;
  };

  getFavoriteNotes() {
    this.noteService.getFavoriteNotes().subscribe({
      next: (response: any) => {
        this.favoriteNotes = response.data;
        this.favoriteNotes.forEach(note => {
          this.noteActionsService.getNoteInteraction(note);
        });
      },
      error: err => {
        this.toastrService.error(err.message);
      }
    });
  };

  openNote(noteId: string) {
    this.noteActionsService.openNote(noteId);
  };

  toggleNoteThumbsUp(note: Note) {
    this.noteActionsService.toggleThumbsUp(note).subscribe({
      next: () => {
        this.getFavoriteNotes();
      },
      error: error => {
        this.toastrService.error(error.error?.error || error.message);
      }
    });
  }

  toggleNoteThumbsDown(note: Note) {
    this.noteActionsService.toggleThumbsDown(note).subscribe({
      next: () => {
        this.getFavoriteNotes();
      },
      error: error => {
        this.toastrService.error(error.error?.error || error.message);
      }
    });
  }

  toggleNoteFavorite(note: Note) {
    this.noteActionsService.toggleFavorite(note).subscribe({
      next: () => {
        this.getFavoriteNotes();
      },
      error: error => {
        this.toastrService.error(error.error?.error || error.message);
      }
    });
  }

  deleteNote() {
    if(this.popupNoteId) {
      this.noteActionsService.deleteNote(this.popupNoteId).subscribe({
        next: (response: any) => {
          this.toastrService.success(response.message);
          this.getFavoriteNotes();
        },
        error: err => this.toastrService.error(err.message)
      });
    }
    this.popupNoteId = null;
  }

  onNoteRequestDelete(noteId: string) {
    this.popupNoteId = noteId;
  };

  closeNotePopup() {
    this.popupNoteId = null;
  };
}

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Note } from 'src/app/_models/noteModel';
import { User } from 'src/app/_models/UserModel';
import { AuthService } from 'src/app/_services/auth.service';
import { NoteActionsService } from 'src/app/_services/note-actions.service';
import { NoteService } from 'src/app/_services/note.service';

@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.css']
})
export class NotesComponent implements OnInit {
  allNotes: Note[] = [];
  userNotes: Note[] = [];
  loggedInUser: User = {} as User;
  popupNoteId: string | null = null;

  constructor(
    private noteService: NoteService,
    private noteActionsService: NoteActionsService,
    private toastrService: ToastrService,
    private authService: AuthService,
    private route: Router
  ) {
    this.loggedInUser = this.authService.getCurrentUser();
  }

  ngOnInit() {
    this.getAllNotes();
    this.getUserNotes();
  }

  getAllNotes() {
    this.noteService.getAllNotes().subscribe({
      next: (response: any) => {
        this.allNotes = response.data;
        this.allNotes.forEach(note => {
          this.noteActionsService.getNoteInteraction(note);
        });
      },
      error: error => {
        this.toastrService.error(error.error?.error || error.message);
      }
    });
  }

  getUserNotes() {
    this.noteService.getUserNotes().subscribe({
      next: (response: any) => {
        this.userNotes = response.data;
        this.userNotes.forEach(note => {
          this.noteActionsService.getNoteInteraction(note);
        });
      },
      error: error => {
        this.toastrService.error(error.error?.error || error.message);
      }
    });
  }

  openNote(noteId: string) {
    this.noteActionsService.openNote(noteId);
  };

  toggleThumbsUp(note: Note) {
    this.noteActionsService.toggleThumbsUp(note).subscribe({
      next: () => {
        this.getAllNotes();
        this.getUserNotes();
      },
      error: error => {
        this.toastrService.error(error.error?.error || error.message);
      }
    });
  }

  toggleThumbsDown(note: Note) {
    this.noteActionsService.toggleThumbsDown(note).subscribe({
      next: () => {
        this.getAllNotes();
        this.getUserNotes();
      },
      error: error => {
        this.toastrService.error(error.error?.error || error.message);
      }
    });
  }

  toggleFavorite(note: Note) {
    this.noteActionsService.toggleFavorite(note).subscribe({
      next: () => {
        this.getAllNotes();
        this.getUserNotes();
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
          this.getAllNotes();
          this.getUserNotes();
        },
        error: err => this.toastrService.error(err.message)
      });
    }
    this.popupNoteId = null;
  };

  onCreate() {
    this.route.navigateByUrl('create-note');
  };

  onRequestDelete(noteId: string) {
    this.popupNoteId = noteId;
  };

  closePopup() {
    this.popupNoteId = null;
  }
}

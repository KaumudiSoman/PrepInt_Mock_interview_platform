import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { UserInteracationService } from './user-interacation.service';
import { Note } from '../_models/noteModel';
import { NoteService } from './note.service';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class NoteActionsService {

  constructor(
    private noteService: NoteService,
    private userInteractionService: UserInteracationService,
    private toastrService: ToastrService,
    private route: Router
  ) { }

  getNoteInteraction(note: Note) {
    this.userInteractionService.getNoteInteraction(note._id).subscribe({
      next: (response: any) => {
        if(response.data) {
          note.isFavorite = response.data.isFavorite || false;
          if(response.data.voteType === 'upvote') {
            note.isThumbsUp = true;
            note.isThumbsDown = false;
          }
          else if (response.data.voteType === 'downvote') {
            note.isThumbsUp = false;
            note.isThumbsDown = true;
          } 
          else {
            note.isThumbsUp = false;
            note.isThumbsDown = false;
          }
        }
      },
      error: error => {
        this.toastrService.error(error.error?.error || error.message);
      }
    });
  };
  
  deleteNote(noteId: string) {
    return this.noteService.deleteNoteById(noteId);
  };

  openNote(noteId: string) {
    this.route.navigateByUrl(`notes/${noteId}`);
  };
  
  toggleFavorite(note: Note) {
    note.isFavorite = !note.isFavorite;
    let inputbody = {
      isFavorite: note.isFavorite
    }
    return this.updateNoteInteraction(note._id, inputbody);
  };
  
  toggleThumbsUp(note: Note) {
    let voteType: 'upvote' | 'downvote' | null = null;

    if (note.isThumbsUp) {
      note.isThumbsUp = false;
      voteType = null;
    }
    else {
      note.isThumbsUp = true;
      voteType = 'upvote';

      if (note.isThumbsDown) {
        note.isThumbsDown = false;
      }
    }
    return this.updateNoteInteraction(note._id, {voteType});
  }
  
  toggleThumbsDown(note: Note) {
    let voteType: 'upvote' | 'downvote' | null = null;

    if (note.isThumbsDown) {
      note.isThumbsDown = false;
      voteType = null;
    }
    else {
      note.isThumbsDown = true;
      voteType = 'downvote';

      if (note.isThumbsUp) {
        note.isThumbsUp = false;
      }
    }
    return this.updateNoteInteraction(note._id, {voteType});
  };
  
  updateNoteInteraction(noteId: string, inputbody: any) {
    return this.userInteractionService.updateNoteInteraction(noteId, inputbody);
  } 
}

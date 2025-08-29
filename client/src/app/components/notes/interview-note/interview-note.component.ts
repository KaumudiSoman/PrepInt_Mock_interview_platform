import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Note } from 'src/app/_models/noteModel';
import { NoteService } from 'src/app/_services/note.service';
import { UtilService } from 'src/app/_services/util.service';

@Component({
  selector: 'app-interview-note',
  templateUrl: './interview-note.component.html',
  styleUrls: ['./interview-note.component.css']
})
export class InterviewNoteComponent implements OnInit {
  note: Note | null = null;

  constructor(
    private utilService: UtilService,
    private noteService: NoteService,
    private route: ActivatedRoute,
    private toastrService: ToastrService
  ) { }

  ngOnInit() {
    this.getNoteById(this.route.snapshot.paramMap.get('id')!);
  }

  getNoteById(noteId: string) {
    this.noteService.getNoteById(noteId).subscribe({
      next: (response: any) => {
        this.note = response.data;
      },
      error: error => {
        this.toastrService.error(error.error?.error || error.message);
      }
    })
  }

  toCamelCase(text: string) {
    return this.utilService.toCamelCase(text);
  }

  formatTechStack(stack: string[]) {
    return this.utilService.formatTechStack(stack);
  }
}

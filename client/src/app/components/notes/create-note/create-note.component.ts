import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NoteService } from 'src/app/_services/note.service';

@Component({
  selector: 'app-create-note',
  templateUrl: './create-note.component.html',
  styleUrls: ['./create-note.component.css']
})
export class CreateNoteComponent implements OnInit {
  noteForm: FormGroup = new FormGroup({});

  constructor(
    private noteService: NoteService,
    private fb: FormBuilder,
    private router: Router,
    private toastrService: ToastrService
  ) { }

  ngOnInit() {
    this.initializeForm();
  }

  initializeForm() {
    this.noteForm = this.fb.group({
      role: ['', Validators.required],
      level: ['', Validators.required],
      type: ['', Validators.required],
      company_type: [''],
      techstack: ['', Validators.required],
      description: ['']
    });
  }

  createNote() {
    const formValue = this.noteForm.value;
    let inputbody = {
      role: String(formValue.role),
      type: String(formValue.type),
      level: String(formValue.level),
      techstack: String(formValue.techstack),
      company_type: String(formValue.company_type),
      description: String(formValue.description)
    }
    this.noteService.createNote(inputbody).subscribe({
      next: (response: any) => {
        this.noteForm.reset();
        this.router.navigateByUrl(`notes/${response.data._id}`);
      },
      error: error => {
        this.toastrService.error(error.error?.error || error.message);
      }
    });
  }
}

import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/_services/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  signupForm: FormGroup = new FormGroup({});
  signedup: Boolean = false;
  selectedFile: File | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private toastrService: ToastrService
  ) { }

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm() {
    this.signupForm = this.fb.group({
      userName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      contactNo: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(20)]],
    });
  }

  onFileSelected(event: any) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
    // if (this.selectedFile) {
    //   this.signupForm.patchValue({ profilePic: file });
    //   this.signupForm.get('profilePic')?.updateValueAndValidity();
    // }
  }

  async signup() {
    const formValue = this.signupForm.value;
    
    const formData = new FormData();
    formData.append('userName', formValue.userName);
    formData.append('email', formValue.email);
    formData.append('contactNo', formValue.contactNo);
    formData.append('password', formValue.password);
    if (this.selectedFile) {
      formData.append('profilePic', this.selectedFile);
    }

    this.authService.signup(formData).subscribe({
      next: (response: any) => {
        this.signedup = true;
      },
      error: err => {this.toastrService.error(err.message)}
    })
  }
}

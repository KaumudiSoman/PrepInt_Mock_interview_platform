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
    })
  }

  signup() {
    const formValue = this.signupForm.value;
    
    let inputbody = {
      username: String(formValue.userName),
      email: String(formValue.email),
      contactNo: String(formValue.contactNo),
      password: String(formValue.password),
    }
    this.authService.signup(inputbody).subscribe({
      next: (response: any) => {
        this.signedup = true;
      },
      error: err => {this.toastrService.error(err.message)}
    })
  }
}

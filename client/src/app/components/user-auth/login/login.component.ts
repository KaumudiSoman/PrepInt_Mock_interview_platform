import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/_services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm : FormGroup = new FormGroup({}); 

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router, private toastrService: ToastrService) { }

  ngOnInit(): void {
      this.initializeForm();
      console.log('load')
  }

  initializeForm() {
    this.loginForm = this.fb.group ({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(4)]]
    });
  }

  login() {
    let formValue = this.loginForm.value;

    let inputbody = {
      email: String(formValue.email),
      password: String(formValue.password)
    }
    
    this.authService.login(inputbody).subscribe({
      next: (response: any) => {
        this.router.navigateByUrl('');
      },
      error: err => {this.toastrService.error(err.message)}
    })
  }
}

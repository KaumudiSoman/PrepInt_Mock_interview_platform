import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/_services/auth.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent {
  resetPasswordForm : FormGroup = new FormGroup({}); 
  token: String = '';

  constructor(private fb: FormBuilder, private authService: AuthService, private toastrService: ToastrService,
    private router: Router, private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
      this.initializeForm();
      this.token = this.route.snapshot.paramMap.get('token')!;
    }
  
  initializeForm() {
    this.resetPasswordForm = this.fb.group ({
      password: ['', [Validators.required]]
    });
  }

  resetPassword() {
    const password = String(this.resetPasswordForm.value.password);
    this.authService.resetPassword(password, this.token).subscribe({
      next: () => {
        this.router.navigateByUrl('login');
        this.toastrService.success('Password reset successfully. Please login to continue.');
      },
      error: err => {this.toastrService.error(err.message)}
    })
  }
}

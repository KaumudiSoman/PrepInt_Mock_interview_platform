import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { User } from 'src/app/_models/UserModel';
import { AuthService } from 'src/app/_services/auth.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent {
  loggedInUser: User = {} as User;
  popup: boolean = false;
  constructor(public authService: AuthService, private router: Router, private toastrService: ToastrService) {
    this.loggedInUser = this.authService.getCurrentUser();
  }

  logout() {
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigateByUrl('login');
      },
      error: err => {
        this.toastrService.error(err.message);
      }
    })
  }

  openPopup() {
    this.popup = true;
  }

  deleteUser() {
    this.authService.deleteUser(this.loggedInUser._id).subscribe({
      next: () => {
        this.router.navigateByUrl('signup');
        this.popup = false;
      },
      error: err => {
        this.toastrService.error(err.message);
      }
    })
  }
}

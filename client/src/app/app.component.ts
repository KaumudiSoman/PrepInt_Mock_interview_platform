import { Component, OnInit } from '@angular/core';
import { User } from './_models/UserModel';
import { AuthService } from './_services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  
  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.setCurrentUser()
  }

  setCurrentUser() {
    const userStr: string | null = localStorage.getItem('loggedInUser');
    if(!userStr) {
      this.authService.setCurrentUser(null);
      return;
    }

    const user: User = JSON.parse(userStr);
    this.authService.setCurrentUser(user);
  }
}

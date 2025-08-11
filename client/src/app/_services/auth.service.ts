import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { APIResources } from '../app.constants';
import { User } from '../_models/UserModel';
import { UtilService } from './util.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private http: HttpClient,
    private utilService: UtilService
  ) {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      this.currentUserSource.next(user);
    }
  }

  private currentUserSource = new BehaviorSubject<User | null>(
    JSON.parse(localStorage.getItem('currentUser') || 'null')
  );
  user$ = this.currentUserSource.asObservable();

  currentUser: User = {} as User;

  signup(body: any) {
    return this.http.post(APIResources.baseUrl + APIResources.users + APIResources.signup, body).pipe(
      map((response: any) => {
        if(response) {
          console.log(response);
          this.currentUser = response.user;
          this.currentUserSource.next(this.currentUser);
          localStorage.setItem('loggedInUser', JSON.stringify(response.data.newUser));
          localStorage.setItem('authToken', JSON.stringify(response.token));
        }
      })
    );
  }

  login(body: any) {
    return this.http.post(APIResources.baseUrl + APIResources.users + APIResources.login, body).pipe(
      map((response: any) => {
        if(response) {
          console.log(response);
          this.currentUser = response.user;
          this.currentUserSource.next(this.currentUser);
          localStorage.setItem('loggedInUser', JSON.stringify(response.user));
          localStorage.setItem('authToken', JSON.stringify(response.token));
        }
      })
    )
  }

  logout() {
    this.setCurrentUser(null);
    localStorage.removeItem('loggedInUser');
    localStorage.removeItem('authToken');
    return this.http.get(APIResources.baseUrl + APIResources.users + APIResources.logout)
  }

  setCurrentUser(user: User | null) {
    this.currentUserSource.next(user);
    if (user) {
      localStorage.setItem('currentUser', JSON.stringify(user));
    } else {
      localStorage.removeItem('currentUser');
    }
  }

  getCurrentUser() {
    this.currentUserSource.subscribe(user => {
      if(user) {
        this.currentUser = user
      }
    })
    console.log('account service, get current user : ', this.currentUser)
    return this.currentUser;
  }

  verifyEmail(token: string) {
    return this.http.get(APIResources.baseUrl + APIResources.users + APIResources.verification + `/${token}`);
  }

  forgotPassword(email: String) {
    return this.http.post(APIResources.baseUrl + APIResources.users + APIResources.forgotPassword, {email: email});
  }

  resetPassword(password: String, token: String) {
    return this.http.post(APIResources.baseUrl + APIResources.users + APIResources.resetPassword + `/${token}`, {password: password});
  }

  deleteUser(userId: String) {
    const headers = this.utilService.setAuthHeader();
    return this.http.delete(APIResources.baseUrl + APIResources.users + `/${userId}`, {headers});
  }
}

import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { APIResources } from '../app.constants';
import { User } from '../_models/UserModel';
import { UtilService } from './util.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private http: HttpClient,
    private utilService: UtilService,
    private router: Router
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

  signup(body: FormData) {
    return this.http.post(APIResources.baseUrl + APIResources.users + APIResources.signup, body).pipe(
      map((response: any) => {
        if(response) {
          this.currentUser = response.user;
          this.currentUserSource.next(this.currentUser);
          localStorage.setItem('loggedInUser', JSON.stringify(response.data.newUser));
          localStorage.setItem('authToken', response.token);
          localStorage.setItem('refreshToken', response.refresh);
        }
      })
    );
  }

  login(body: any) {
    return this.http.post(APIResources.baseUrl + APIResources.users + APIResources.login, body).pipe(
      map((response: any) => {
        if(response) {
          this.currentUser = response.user;
          this.currentUserSource.next(this.currentUser);
          localStorage.setItem('loggedInUser', JSON.stringify(response.user));
          localStorage.setItem('authToken', response.token);
          localStorage.setItem('refreshToken', response.refresh);
        }
      })
    )
  }

  logout() {
    const refreshToken = localStorage.getItem('refreshToken');
    this.setCurrentUser(null);
    localStorage.removeItem('loggedInUser');
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    return this.http.get(APIResources.baseUrl + APIResources.users + APIResources.logout, {headers: { 'x-refresh-token': refreshToken || '' }});
  }

  forceLogout() {
    // For interceptor or token errors
    this.setCurrentUser(null);
    localStorage.removeItem('loggedInUser');
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    this.router.navigateByUrl('login');
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
    });
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

  refreshTokens(refresh: any) {
    const headers = { 'x-refresh-token': refresh };
    return this.http.get(APIResources.baseUrl + APIResources.users + APIResources.RefreshTokens, {headers});
  }
}

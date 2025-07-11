import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilService {

  constructor() { }

  isLoggedIn() {
    const loggedInStr: string | null = localStorage.getItem('token');
    if(loggedInStr) {
      return true;
    }
    return false;
  }

  setAuthHeader() {
    let authToken = localStorage.getItem('authToken') || '';
    authToken = authToken.replace(/^"(.*)"$/, '$1');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${authToken}`);
    return headers;
  }
}

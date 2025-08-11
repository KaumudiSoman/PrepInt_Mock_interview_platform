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

  toCamelCase(text: string): string {
    return text
      .toLowerCase()
      .replace(/(?:^|\s)\w/g, match => match.toUpperCase());
  };

  formatTechStack(techstack: string[]): string {
  if (!techstack || techstack.length === 0) return '';

    return techstack
      .map(item => {
        if (!item) return '';
        return item.charAt(0).toUpperCase() + item.slice(1).toLowerCase();
      })
      .join(', ');
  }
}

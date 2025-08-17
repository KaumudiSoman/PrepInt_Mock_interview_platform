import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UtilService } from './util.service';
import { APIResources } from '../app.constants';

@Injectable({
  providedIn: 'root'
})
export class AttemptsService {

  constructor(
    private http: HttpClient,
    private utilService: UtilService
  ) { }

  createAttempt(interviewId: string) {
    const headers = this.utilService.setAuthHeader();
    return this.http.post(APIResources.baseUrl + APIResources.interviews + APIResources.attempts, interviewId, {headers});
  }

  getAttemptsCount(interviewId: string) {
    const headers = this.utilService.setAuthHeader();
    return this.http.get(APIResources.baseUrl + APIResources.interviews + `/${interviewId}` + APIResources.attempts + APIResources.attemptCount, {headers});
  }

  getAttemptNumber(interviewId: string, attempId: string) {
    const headers = this.utilService.setAuthHeader();
    return this.http.get(APIResources.baseUrl + APIResources.interviews + `/${interviewId}` + APIResources.attempts + `/${attempId}` + APIResources.attemptNumber, {headers});
  }
}

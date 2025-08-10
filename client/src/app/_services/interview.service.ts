import { Injectable } from '@angular/core';
import { UtilService } from './util.service';
import { HttpClient } from '@angular/common/http';
import { APIResources } from '../app.constants';

@Injectable({
  providedIn: 'root'
})
export class InterviewService {

  constructor(private utilService: UtilService, private http: HttpClient) { }

  getAllInterviews() {
    const headers = this.utilService.setAuthHeader();
    return this.http.get(APIResources.baseUrl + APIResources.interviews, {headers});
  }

  getUserInterviews() {
    const headers = this.utilService.setAuthHeader();
    return this.http.get(APIResources.baseUrl + APIResources.interviews + APIResources.getMyInterviews, {headers});
  }

  deleteInterview(interviewId: string) {
    const headers = this.utilService.setAuthHeader();
    return this.http.delete(APIResources.baseUrl + APIResources.interviews + `/${interviewId}`, {headers});
  }

  getFavoriteInterviews() {
    const headers = this.utilService.setAuthHeader();
    return this.http.get(APIResources.baseUrl + APIResources.interviews + APIResources.getFavoriteInterviews, {headers});
  }
}

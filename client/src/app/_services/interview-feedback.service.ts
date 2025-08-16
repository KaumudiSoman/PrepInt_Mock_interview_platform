import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { APIResources } from '../app.constants';
import { UtilService } from './util.service';

@Injectable({
  providedIn: 'root'
})
export class InterviewFeedbackService {

  constructor(
    private http: HttpClient,
    private utilService: UtilService
  ) { }

  createFeedback(inputbody: any) {
    const headers = this.utilService.setAuthHeader();
    return this.http.post(APIResources.baseUrl + APIResources.interviews + APIResources.feedback, inputbody, {headers});
  }

  getFeedbackById(feedbackId: string) {
    const headers = this.utilService.setAuthHeader();
    return this.http.get(APIResources.baseUrl + APIResources.interviews + APIResources.feedback + `/${feedbackId}`, {headers});
  }

  getAllFeedbacks() {
    const headers = this.utilService.setAuthHeader();
    return this.http.get(APIResources.baseUrl + APIResources.interviews + APIResources.feedback, {headers});
  }
}

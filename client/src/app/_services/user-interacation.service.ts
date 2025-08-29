import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { APIResources } from '../app.constants';
import { UtilService } from './util.service';

@Injectable({
  providedIn: 'root'
})
export class UserInteracationService {

  constructor(
    private utilService: UtilService,
    private http: HttpClient
  ) { }

  getInterviewInteraction(interviewId: string) {
    const headers = this.utilService.setAuthHeader();
    return this.http.get(APIResources.baseUrl + APIResources.userInteractions + APIResources.interview + `/${interviewId}`, {headers});
  }

  updateInterviewInteraction(interviewId: string, inputbody: any) {
    const headers = this.utilService.setAuthHeader();
    return this.http.put(APIResources.baseUrl + APIResources.userInteractions + APIResources.interview + `/${interviewId}`, inputbody, {headers});
  }

  getNoteInteraction(noteId: string) {
    const headers = this.utilService.setAuthHeader();
    return this.http.get(APIResources.baseUrl + APIResources.userInteractions + APIResources.note + `/${noteId}`, {headers});
  }

  updateNoteInteraction(noteId: string, inputbody: any) {
    const headers = this.utilService.setAuthHeader();
    return this.http.put(APIResources.baseUrl + APIResources.userInteractions + APIResources.note + `/${noteId}`, inputbody, {headers});
  }
}

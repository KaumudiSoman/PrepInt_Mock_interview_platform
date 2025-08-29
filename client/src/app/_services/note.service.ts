import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UtilService } from './util.service';
import { APIResources } from '../app.constants';

@Injectable({
  providedIn: 'root'
})
export class NoteService {

  constructor(
    private http: HttpClient,
    private utilService: UtilService
  ) { }

  getAllNotes() {
    const headers = this.utilService.setAuthHeader();
    return this.http.get(APIResources.baseUrl + APIResources.notes, {headers});
  }

  getUserNotes() {
    const headers = this.utilService.setAuthHeader();
    return this.http.get(APIResources.baseUrl + APIResources.notes + APIResources.getMyNotes, {headers});
  }

  getFavoriteNotes() {
    const headers = this.utilService.setAuthHeader();
    return this.http.get(APIResources.baseUrl + APIResources.notes + APIResources.getFavoriteNotes, {headers});
  }

  getNoteById(noteId: string) {
    const headers = this.utilService.setAuthHeader();
    return this.http.get(APIResources.baseUrl + APIResources.notes + `/${noteId}`, {headers});
  }

  deleteNoteById(noteId: string) {
    const headers = this.utilService.setAuthHeader();
    return this.http.delete(APIResources.baseUrl + APIResources.notes + `/${noteId}`, {headers});
  }
}

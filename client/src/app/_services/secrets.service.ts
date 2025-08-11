import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UtilService } from './util.service';
import { APIResources } from '../app.constants';

@Injectable({
  providedIn: 'root'
})
export class SecretsService {

  constructor(
    private http: HttpClient,
    private utilService: UtilService
  ) { }

  getSecrets() {
    const headers = this.utilService.setAuthHeader();
    return this.http.get(APIResources.baseUrl + APIResources.getSecrets, {headers});
  }
}

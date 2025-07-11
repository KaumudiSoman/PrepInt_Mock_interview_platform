import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import Vapi from '@vapi-ai/web';
import { UtilService } from './util.service';
import { APIResources } from '../app.constants';

type VapiEvents = 'call-start' | 'call-end' | 'speech-start' | 'speech-end' | 'message' | 'error';

@Injectable({
  providedIn: 'root'
})
export class AgentService {

  // constructor(private http: HttpClient, private utilService: UtilService) { }

  // createInterview(inputbody: any) {
  //   const headers = this.utilService.setAuthHeader();
  //   return this.http.post(APIResources.baseUrl + APIResources.interviews, inputbody, {headers});
  // }

  private vapi: Vapi;

  constructor() {
    this.vapi = new Vapi('558b0608-5800-4801-8ed1-b55a88b0bb0d'); // Public API key
  }

  startCall(workflowId: string, variableValues: any) {
    return this.vapi.start(workflowId, { variableValues });
  }

  stopCall() {
    this.vapi.stop();
  }

  on(event: VapiEvents, handler: (...args: any[]) => void) {
    this.vapi.on(event as any, handler as any);
  }

  off(event: VapiEvents, handler: (...args: any[]) => void) {
    this.vapi.off(event as any, handler as any);
  }
}

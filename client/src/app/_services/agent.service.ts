import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { VapiClient } from "@vapi-ai/server-sdk";
import Vapi from "@vapi-ai/web";
import { UtilService } from './util.service';
import { APIResources } from '../app.constants';

type VapiEvents = 'call-start' | 'call-end' | 'speech-start' | 'speech-end' | 'message' | 'error';

@Injectable({
  providedIn: 'root'
})
export class AgentService {
  vapi: Vapi;
  call: any;

  constructor() {
    //509605bc-e2b4-487f-983d-24a1fed9460e // Private API key
    this.vapi = new Vapi("558b0608-5800-4801-8ed1-b55a88b0bb0d"); // Public API key
  }

  async startCall(workflowId: string, variableValues: any) {
    return await this.vapi.start(
      undefined,
      undefined,
      undefined,
      workflowId,
      {variableValues}
    );
  }

  async stopCall() {
    return await this.vapi.stop();
  }

  on(event: VapiEvents, handler: (...args: any[]) => void) {
    this.vapi.on(event as any, handler as any);
  }

  off(event: VapiEvents, handler: (...args: any[]) => void) {
    this.vapi.off(event as any, handler as any);
  }
}

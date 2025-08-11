import { Injectable } from '@angular/core';
import Vapi from '@vapi-ai/web';
import { interviewer } from '../app.constants';
import { SecretsService } from './secrets.service';
import { ToastrService } from 'ngx-toastr';

type VapiEvents = 'call-start' | 'call-end' | 'speech-start' | 'speech-end' | 'message' | 'error';

@Injectable({
  providedIn: 'root'
})
export class InterviewAgentService {
  private vapi: Vapi;
  private isCallActive = false;
  publicKey: string = "";

  constructor(
    private secretsService: SecretsService,
    private toastrService: ToastrService
  ) {
    this.getSecrets();
    this.vapi = new Vapi("558b0608-5800-4801-8ed1-b55a88b0bb0d");

    this.vapi.on('call-start', () => {
      this.isCallActive = true;
    });
    
    this.vapi.on('call-end', () => {
      this.isCallActive = false;
    });
    
    this.vapi.on('error', () => {
      this.isCallActive = false;
    });
  }

  getSecrets() {
    this.secretsService.getSecrets().subscribe({
      next: (response: any) => {
        this.publicKey = response.data.VAPI_PUBLIC_API_KEY;
      },
      error: err => this.toastrService.error(err.message)
    });
  }
  
  // For interview creation
  async startCreationCall(workflowId: string, variableValues: any) {
    if (this.isCallActive) {
      throw new Error('Another call is already active');
    }
    
    return await this.vapi.start(
      undefined,
      undefined,
      undefined,
      workflowId,
      { variableValues }
    );
  }

  // For interview conducting
  async startConductingCall(variableValues: any) {
    if (this.isCallActive) {
      throw new Error('Another call is already active');
    }
    
    return await this.vapi.start(
      interviewer,
      { variableValues }
    );
  }

  async stopCall() {
    if (!this.isCallActive) {
      return;
    }
    return await this.vapi.stop();
  }

  on(event: VapiEvents, handler: (...args: any[]) => void) {
    this.vapi.on(event as any, handler as any);
  }

  off(event: VapiEvents, handler: (...args: any[]) => void) {
    this.vapi.off(event as any, handler as any);
  }

  isActive(): boolean {
    return this.isCallActive;
  }
}

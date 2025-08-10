import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Vapi from '@vapi-ai/web';
import { firstValueFrom } from 'rxjs';
import { User } from 'src/app/_models/UserModel';
import { AgentService } from 'src/app/_services/agent.service';
import { AuthService } from 'src/app/_services/auth.service';

enum CallStatus {
  INACTIVE = 'INACTIVE',
  CONNECTING = 'CONNECTING',
  ACTIVE = 'ACTIVE',
  FINISHED = 'FINISHED',
}

@Component({
  selector: 'app-agent',
  templateUrl: './agent.component.html',
  styleUrls: ['./agent.component.css']
})
export class AgentComponent implements OnInit, OnDestroy {
  callStatus: CallStatus = CallStatus.INACTIVE;
  currentSpeaker: 'user' | 'bot' | null = null;
  messages: { role: string; content: string }[] = [];
  lastMessage = '';
  workflowId = "dff194a3-466e-4861-99ad-c787e38d4239";
  loggedInUser: User = {} as User;

  constructor(private agentService: AgentService, private authService: AuthService, private route: Router) {
    this.loggedInUser = this.authService.getCurrentUser();
  }

  ngOnInit(): void {
    this.agentService.on('call-start', () => {
      this.callStatus = CallStatus.ACTIVE;
    });

    this.agentService.on('call-end', () => {
      this.callStatus = CallStatus.FINISHED;
      this.currentSpeaker = null;
      this.route.navigateByUrl('');
    });

    this.agentService.on('speech-start', (data: any) => {
      this.currentSpeaker = data?.role === 'user' ? 'user' : 'bot';
    });

    this.agentService.on('speech-end', () => {
      this.currentSpeaker = null;
    });

    this.agentService.on('message', (msg: any) => {
      if (msg.type === 'transcript' && msg.transcriptType === 'final') {
        const newMsg = { role: msg.role, content: msg.transcript };
        this.messages.push(newMsg);
        this.lastMessage = newMsg.content;
      }
    });

    this.agentService.on('error', (err: any) => {
      console.error('Vapi error:', err);
    });
  }

  ngOnDestroy(): void {
    // this.agentService.off('call-start', () => (this.callStatus = CallStatus.ACTIVE));
    // this.agentService.off('call-end', () => (this.callStatus = CallStatus.FINISHED));
    // this.agentService.off('speech-start', () => {});
    // this.agentService.off('speech-end', () => {});
    // this.agentService.off('message', () => {});
  }

  startCall() {
    this.callStatus = CallStatus.CONNECTING;
    this.agentService.startCall(this.workflowId, {
      username: this.loggedInUser.username,
      userid: this.loggedInUser._id,
    });
  }

  stopCall() {
    this.agentService.stopCall();
    this.callStatus = CallStatus.FINISHED;
    this.currentSpeaker = null;
  }
}
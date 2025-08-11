import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { User } from 'src/app/_models/UserModel';
import { AuthService } from 'src/app/_services/auth.service';
import { InterviewAgentService } from 'src/app/_services/interview-agent.service';
import { SecretsService } from 'src/app/_services/secrets.service';

enum CallStatus {
  INACTIVE = 'INACTIVE',
  CONNECTING = 'CONNECTING',
  ACTIVE = 'ACTIVE',
  FINISHED = 'FINISHED',
}

@Component({
  selector: 'app-interview-creation-agent',
  templateUrl: './interview-creation-agent.component.html',
  styleUrls: ['./interview-creation-agent.component.css']
})
export class InterviewCreationAgentComponent implements OnInit {
  callStatus: CallStatus = CallStatus.INACTIVE;
  currentSpeaker: 'user' | 'bot' | null = null;
  messages: { role: string; content: string }[] = [];
  lastMessage = '';
  workflowId: string = "";
  loggedInUser: User = {} as User;

  constructor(
    private agentService: InterviewAgentService,
    private authService: AuthService,
    private route: Router,
    private secretsService: SecretsService,
    private toastrService: ToastrService
  ) {
    this.loggedInUser = this.authService.getCurrentUser();
    this.getSecrets();
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

  getSecrets() {
    this.secretsService.getSecrets().subscribe({
      next: (response: any) => {
        this.workflowId = response.data.VAPI_WORKFLOW_ID;
      },
      error: err => this.toastrService.error(err.message)
    });
  }

  startCall() {
    this.callStatus = CallStatus.CONNECTING;
    this.agentService.startCreationCall(this.workflowId, {
      username: this.loggedInUser.username,
      userid: this.loggedInUser._id,
    }).catch(error => {
      console.error('Failed to start call:', error);
      this.callStatus = CallStatus.INACTIVE;
    });
  }

  stopCall() {
    this.agentService.stopCall();
    this.callStatus = CallStatus.FINISHED;
    this.currentSpeaker = null;
  }
}
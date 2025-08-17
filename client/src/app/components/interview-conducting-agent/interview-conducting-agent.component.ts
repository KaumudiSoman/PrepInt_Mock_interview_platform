import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Interview } from 'src/app/_models/InterviewModel';
import { User } from 'src/app/_models/UserModel';
import { AttemptsService } from 'src/app/_services/attempts.service';
import { AuthService } from 'src/app/_services/auth.service';
import { InterviewAgentService } from 'src/app/_services/interview-agent.service';
import { InterviewFeedbackService } from 'src/app/_services/interview-feedback.service';
import { InterviewService } from 'src/app/_services/interview.service';
import { SecretsService } from 'src/app/_services/secrets.service';
import { UtilService } from 'src/app/_services/util.service';

enum CallStatus {
  INACTIVE = 'INACTIVE',
  CONNECTING = 'CONNECTING',
  ACTIVE = 'ACTIVE',
  FINISHED = 'FINISHED',
}

@Component({
  selector: 'app-interview-conducting-agent',
  templateUrl: './interview-conducting-agent.component.html',
  styleUrls: ['./interview-conducting-agent.component.css']
})
export class InterviewConductingAgentComponent implements OnInit {
  callStatus: CallStatus = CallStatus.INACTIVE;
  currentSpeaker: 'user' | 'bot' | null = null;
  messages: { role: string; content: string }[] = [];
  lastMessage = '';
  workflowId: string = "";
  loggedInUser: User = {} as User;
  interviewId: string = "";
  interview: Interview | null = null;
  userEndedCall: boolean = false;
  attempId: string = "";

  constructor(
    private agentService: InterviewAgentService,
    private authService: AuthService,
    private router: Router, 
    private interviewService: InterviewService, 
    private route: ActivatedRoute,
    private utilService: UtilService,
    private feedbackService: InterviewFeedbackService,
    private toastrService: ToastrService,
    private secretsService: SecretsService,
    private attemptsService: AttemptsService
  ) {
    this.loggedInUser = this.authService.getCurrentUser();
    this.getSecrets();
  }

  ngOnInit(): void {
    this.interviewId = this.route.snapshot.paramMap.get('id')!;
    this.getInterview(this.interviewId);

    this.agentService.on('call-start', () => {
      this.callStatus = CallStatus.ACTIVE;
    });

    this.agentService.on('call-end', () => {
      this.callStatus = CallStatus.FINISHED;
      this.currentSpeaker = null;
      if (this.userEndedCall) {
        this.router.navigateByUrl('');
      } else {
        this.createAttempt(this.interviewId);
        this.createFeedback(this.messages);
      }
      this.userEndedCall = false;
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

  getInterview(intId: string) {
    this.interviewService.getInterviewById(intId).subscribe({
      next: (response: any) => {
        this.interview = response.data;
        this.getAttempts(this.interview!);
      }
    });
  }

  startCall() {
    if (this.agentService.isActive()) {
      console.log('Another call is already active');
      return;
    }

    this.callStatus = CallStatus.CONNECTING;
    let formattedQuestions = "";
    if(this.interview?.questions) {
      formattedQuestions = this.interview.questions.map((question) => `- ${question}`).join('\n');
    }
    
    this.agentService.startConductingCall({
      questions: formattedQuestions
    }).catch(error => {
      console.error('Failed to start call:', error);
      this.callStatus = CallStatus.INACTIVE;
    });
  }

  stopCall() {
    this.userEndedCall = true;
    this.agentService.stopCall();
    this.callStatus = CallStatus.FINISHED;
    this.currentSpeaker = null;
  }

  toCamelCase(text: string) {
    return this.utilService.toCamelCase(text);
  }

  formatTechStack(techstack: string[]) {
    return this.utilService.formatTechStack(techstack);
  }

  createAttempt(interviewId: string) {
    this.attemptsService.createAttempt(interviewId).subscribe({
      next: (response: any) => {
        this.attempId = response.data._id;
      },
      error: error => {
        this.toastrService.error(error.message);
      }
    });
  }

  createFeedback(transcript: { role: string; content: string }[]) {
    let inputbody = {
      interviewId: this.interviewId,
      userId: this.loggedInUser._id,
      attempId: this.attempId,
      transcript: transcript
    }
    this.feedbackService.createFeedback(inputbody).subscribe({
      next: (response: any) => this.router.navigateByUrl(`interview-feedback/${response.data._id}`),
      error: error => this.toastrService.error(error.message)
    });
  }

  getAttempts(interview: Interview) {
    this.attemptsService.getAttemptsCount(interview._id).subscribe({
      next: (response: any) => {
        interview.attempts = response.data;
      },
      error: error => {
        this.toastrService.error(error.message);
      }
    });
  }
}

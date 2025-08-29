import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { SignupComponent } from './components/user-auth/signup/signup.component';
import { LoginComponent } from './components/user-auth/login/login.component';
import { VerifyEmailComponent } from './components/user-auth/verify-email/verify-email.component';
import { ForgotPasswordComponent } from './components/user-auth/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './components/user-auth/reset-password/reset-password.component';
import { InterviewCreationAgentComponent } from './components/interview-creation-agent/interview-creation-agent.component';
import { FavoriteInterviewsComponent } from './components/favorite-interviews/favorite-interviews.component';
import { InterviewConductingAgentComponent } from './components/interview-conducting-agent/interview-conducting-agent.component';
import { InterviewFeedbackComponent } from './components/interview-feedback/interview-feedback.component';
import { FeedbacksComponent } from './components/feedbacks/feedbacks.component';
import { NotesComponent } from './components/notes/notes/notes.component';
import { InterviewNoteComponent } from './components/notes/interview-note/interview-note.component';

const routes: Routes = [
  {path: '', component: DashboardComponent},
  {path: 'signup', component: SignupComponent},
  {path: 'login', component: LoginComponent},
  {path: 'verify-email/:token', component: VerifyEmailComponent},
  {path: 'forgot-password', component: ForgotPasswordComponent},
  {path: 'reset-password/:token', component: ResetPasswordComponent},
  {path: 'create-interview', component: InterviewCreationAgentComponent},
  {path: 'start-interview/:id', component: InterviewConductingAgentComponent},
  {path: 'favorite-interviews', component: FavoriteInterviewsComponent},
  {path: 'feedbacks', component: FeedbacksComponent},
  {path: 'interview-feedback/:id', component: InterviewFeedbackComponent},
  {path: 'notes', component: NotesComponent},
  {path: 'notes/:id', component: InterviewNoteComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

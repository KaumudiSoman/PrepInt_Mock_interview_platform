import { NgModule } from '@angular/core';

import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { ReactiveFormsModule } from '@angular/forms';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { SignupComponent } from './components/user-auth/signup/signup.component';
import { LoginComponent } from './components/user-auth/login/login.component';
import { NavComponent } from './components/nav/nav.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { VerifyEmailComponent } from './components/user-auth/verify-email/verify-email.component';
import { ForgotPasswordComponent } from './components/user-auth/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './components/user-auth/reset-password/reset-password.component';
import { InterviewCreationAgentComponent } from './components/interview-creation-agent/interview-creation-agent.component';
import { FavoriteInterviewsComponent } from './components/favorite-interviews/favorite-interviews.component';
import { InterviewCardGridComponent } from './components/custom-components/interview-card-grid/interview-card-grid.component';
import { InterviewConductingAgentComponent } from './components/interview-conducting-agent/interview-conducting-agent.component';
import { InterviewFeedbackComponent } from './components/interview-feedback/interview-feedback.component';
import { AuthErrorInterceptor } from './_interceptors/auth-error.interceptor';
import { FeedbacksComponent } from './components/feedbacks/feedbacks.component';
import { ConfirmationDialogComponent } from './components/custom-components/confirmation-dialog/confirmation-dialog.component';
import { InterviewNoteComponent } from './components/notes/interview-note/interview-note.component';
import { NotesComponent } from './components/notes/notes/notes.component';

@NgModule({
  declarations: [
    AppComponent,
    SignupComponent,
    LoginComponent,
    NavComponent,
    DashboardComponent,
    VerifyEmailComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    InterviewCreationAgentComponent,
    FavoriteInterviewsComponent,
    InterviewCardGridComponent,
    InterviewConductingAgentComponent,
    InterviewFeedbackComponent,
    FeedbacksComponent,
    ConfirmationDialogComponent,
    InterviewNoteComponent,
    NotesComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    BsDropdownModule.forRoot(),
    ToastrModule.forRoot({positionClass: 'toast-bottom-right'}),
    BrowserAnimationsModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthErrorInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

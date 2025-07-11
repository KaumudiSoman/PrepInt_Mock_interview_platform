import { NgModule } from '@angular/core';

import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
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
import { AgentComponent } from './components/agent/agent.component';

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
    AgentComponent
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
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { SignupComponent } from './components/user-auth/signup/signup.component';
import { LoginComponent } from './components/user-auth/login/login.component';
import { VerifyEmailComponent } from './components/user-auth/verify-email/verify-email.component';
import { ForgotPasswordComponent } from './components/user-auth/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './components/user-auth/reset-password/reset-password.component';
import { AgentComponent } from './components/agent/agent.component';
import { FavoriteInterviewsComponent } from './components/favorite-interviews/favorite-interviews.component';

const routes: Routes = [
  {path: '', component: DashboardComponent},
  {path: 'signup', component: SignupComponent},
  {path: 'login', component: LoginComponent},
  {path: 'verify-email/:token', component: VerifyEmailComponent},
  {path: 'forgot-password', component: ForgotPasswordComponent},
  {path: 'reset-password/:token', component: ResetPasswordComponent},
  {path: 'create-interview', component: AgentComponent},
  {path: 'favorite-interviews', component: FavoriteInterviewsComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

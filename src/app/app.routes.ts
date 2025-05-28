import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { LoginGuard } from './auth/login.guard'; // Importation du guard de connexion
import { AuthGuard } from './auth/auth.guard'; // Importation du guard d'authentification
import { AdminComponent } from './admin/admin.component'; // Composant principal pour l'admin
import { DashboardComponent } from './dashboard/dashboard.component'; // Composant de dashboard
import {UtilisateursComponent} from './utilisateurs/utilisateurs.component'; // Composant pour les utilisateurs
import {AddUtilisateursComponent} from './utilisateurs/add-utilisateurs/add-utilisateurs.component'; // Composant pour ajouter des utilisateurs
import {EditUtilisateursComponent} from './utilisateurs/edit-utilisateurs/edit-utilisateurs.component'
import {ChangePasswordComponent} from './auth/change-password/change-password.component';
import {ForgotPasswordComponent} from './auth/forgot-password/forgot-password.component';
import {CodeOtpComponent} from './auth/code-otp/code-otp.component';
import {ResetPasswordComponent} from './auth/reset-password/reset-password.component';

import {HomeComponent} from './home/home.component';
import {CreateAccountComponent} from './create-account/create-account.component';
import {JobOffersComponent} from './job-offers/job-offers.component';
import {CompaniesComponent} from './companies/companies.component';
import {CandidatesComponent} from './candidates/candidates.component';
import {CandidatesCreateAccountsComponent} from './candidates/candidates-create-accounts/candidates-create-accounts.component';
import {OwnersCreateAccountsComponent} from './owners/owners-create-accounts/owners-create-accounts.component';
import {OffersFreelanceComponent} from './offers-freelance/offers-freelance.component';
import {CompanyComponent} from './main/company/company.component';



export const routes: Routes = [
  { 
    path: 'login', 
    component: LoginComponent, 
    canActivate: [LoginGuard] 
  },
  
  
  // Route de l'admin (avec sous-routes)
  {
    path: 'admin', 
    component: AdminComponent, // Composant principal pour l'admin
    canActivate: [AuthGuard], // Protège cette route avec un guard d'authentification
    children: [
        { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
        { path: 'users', component: UtilisateursComponent, canActivate: [AuthGuard] },
        { path: 'users/add', component: AddUtilisateursComponent, canActivate: [AuthGuard] },
        { path: 'users/edit/:uuid', component: EditUtilisateursComponent, canActivate: [AuthGuard] },
        { path : 'main/company', component:CompanyComponent,canActivate:[AuthGuard]},
        { path: '', redirectTo: '/admin/dashboard', pathMatch: 'full' }
      ]
    },
  // 👇 Home devient la route par défaut
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'create-account', component: CreateAccountComponent },
  { path: 'job-offers', component: JobOffersComponent },
  { path: 'companies', component: CompaniesComponent },
  { path: 'candidates', component: CandidatesComponent },
  { path:'offers_freelance',component:OffersFreelanceComponent},
  { path: 'candidates/create-account', component: CandidatesCreateAccountsComponent },
  { path: 'owners/create-account', component: OwnersCreateAccountsComponent },

  { path: 'auth/change-password', component: ChangePasswordComponent, canActivate: [AuthGuard] },
  { path: 'auth/forgot-password', component: ForgotPasswordComponent },
  { path: 'auth/code-otp', component: CodeOtpComponent },
  { path: 'auth/reset-password', component: ResetPasswordComponent },
];

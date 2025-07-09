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
import {OwnersComponent} from './main/owners/owners.component';
import {LoginUsersComponent} from './main/login-users/login-users.component';

import {DiplomasComponent} from './users/diplomas/diplomas.component';
import {ExperiencesComponent} from './users/experiences/experiences.component';
import {CompetencesComponent} from './users/competences/competences.component';
import {LangagesComponent} from './users/langages/langages.component';
import {HobbiesComponent} from './users/hobbies/hobbies.component';
import {OthersComponent} from './users/others/others.component';
import {MediasComponent} from './users/medias/medias.component';
import {MyJobOffersUsersComponent} from './users/my-job-offers-users/my-job-offers-users.component';

import {MyJobOffersComponent} from './owners/my-job-offers/my-job-offers.component';
import {MyCandidatesComponent} from './owners/my-candidates/my-candidates.component';
import {MyAccountsComponent} from './owners/my-accounts/my-accounts.component';
import {DetailsCandidatesComponent} from './owners/details-candidates/details-candidates.component';


export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [LoginGuard]
  },

  // ADMIN ROUTES
  {
    path: 'admin',
    component: AdminComponent, // ou AdminLayoutComponent
    canActivate: [AuthGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent,canActivate: [LoginGuard] },
      { path: 'users', component: UtilisateursComponent,canActivate: [LoginGuard] },
      { path: 'users/add', component: AddUtilisateursComponent,canActivate: [LoginGuard] },
      { path: 'users/edit/:uuid', component: EditUtilisateursComponent,canActivate: [LoginGuard] },
      { path: 'main/company', component: CompanyComponent,canActivate: [LoginGuard] },
      { path: 'main/owners', component: OwnersComponent,canActivate: [LoginGuard] },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },

  // USER ROUTES
  {
    path: 'users',
    component: AdminComponent, // 👈 même layout que l'admin
    canActivate: [AuthGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent,canActivate: [LoginGuard] },
      { path: 'users/diplomas', component: DiplomasComponent,canActivate: [LoginGuard] },
      { path : 'users/experiences', component:ExperiencesComponent,canActivate:[LoginGuard]},
      { path: 'users/competences', component: CompetencesComponent,canActivate: [LoginGuard] },
      { path: 'users/languages', component:LangagesComponent, canActivate: [LoginGuard]},
      { path: 'users/hobbies', component:HobbiesComponent, canActivate: [LoginGuard]},
      { path: 'users/others', component:OthersComponent, canActivate: [LoginGuard]},
      { path: 'users/medias', component:MediasComponent, canActivate: [LoginGuard]},
      { path: 'users/jobs_offers', component:MyJobOffersUsersComponent, canActivate: [LoginGuard]},
      

      // Ajoute d'autres routes spécifiques aux users ici
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },

  {
    path: 'owners',
    component : AdminComponent,
    canActivate : [AuthGuard],
    children :[
      { path: 'dashboard', component: DashboardComponent,canActivate: [LoginGuard] },
      { path: 'owners/my_job_offers', component: MyJobOffersComponent,canActivate: [LoginGuard]},
      { path: 'owners/my_candidates', component: MyCandidatesComponent,canActivate: [LoginGuard]},
      { path: 'owners/my_accounts', component: MyAccountsComponent,canActivate: [LoginGuard]},
      { path: 'details_candidates', component: DetailsCandidatesComponent, canActivate: [LoginGuard] },





      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },

  // AUTRES ROUTES PUBLIQUES
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'create-account', component: CreateAccountComponent },
  { path: 'job-offers', component: JobOffersComponent },
  { path: 'companies', component: CompaniesComponent },
  { path: 'candidates', component: CandidatesComponent },
  { path: 'offers_freelance', component: OffersFreelanceComponent },
  { path: 'candidates/create-account', component: CandidatesCreateAccountsComponent },
  { path: 'owners/create-account', component: OwnersCreateAccountsComponent },
  { path: 'main/login-users', component: LoginUsersComponent },
  { path: 'auth/change-password', component: ChangePasswordComponent, canActivate: [AuthGuard] },
  { path: 'auth/forgot-password', component: ForgotPasswordComponent },
  { path: 'auth/code-otp', component: CodeOtpComponent },
  { path: 'auth/reset-password', component: ResetPasswordComponent },
];

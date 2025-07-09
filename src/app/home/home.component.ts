import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { HttpClient ,HttpParams} from '@angular/common/http';  // Import HttpClient
import { CONFIG } from '../../../config';
import { FormsModule } from '@angular/forms'; 
import {NavbarComponent} from '../components/navbar/navbar.component';
import {FooterComponent} from '../components/footer/footer.component';
import {NewslettersComponent} from '../components/newsletters/newsletters.component';
import {RoleService } from '../services/role.service';
import { ElementRef, ViewChild, Inject, PLATFORM_ID } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule, FormsModule, NavbarComponent,FooterComponent,NewslettersComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
company: any[] = [];
candidates: any[] = [];

// États de chargement
isLoadingCompanies: boolean = false;
isLoadingCandidates: boolean = false;

// Pagination pour les entreprises
currentCompanyPage: number = 1;
totalCompanyPages: number = 0;
companiesPerPage: number = 25;
totalCompanyItems: number = 0;

// Pagination pour les candidats
currentCandidatePage: number = 1;
totalCandidatePages: number = 0;
candidatesPerPage: number = 10; // ✅ Pour afficher 10 derniers candidats
totalCandidateItems: number = 0;

searchQuery: string = '';
exportUrl: string = '';
direction: { [key: string]: 'asc' | 'desc' } = {};
isAuthenticated: boolean = false;

constructor(
  private http: HttpClient,
  private toastr: ToastrService,
  public role: RoleService,
  public authService: AuthService,
  @Inject(PLATFORM_ID) private platformId: Object
) {}

ngOnInit(): void {
  this.isAuthenticated = !!this.authService.getToken();
  this.getActivateCompanies();
  this.getLatestCandidates();

  
}

getActivateCompanies(): void {
  this.isLoadingCompanies = true;

  const params = new HttpParams()
    .set('page', this.currentCompanyPage.toString())
    .set('per_page', this.companiesPerPage.toString());

  this.http.get<any>(`${CONFIG.apiUrl}/company/activate_company`, { params })
    .subscribe(
      (response) => {
        this.company = [...this.company, ...response.data];
        this.currentCompanyPage = response.current_page;
        this.totalCompanyPages = response.pages;
        this.totalCompanyItems = response.total;
        this.isLoadingCompanies = false;
      },
      (error) => {
        this.toastr.error('Erreur lors du chargement des entreprises');
        this.isLoadingCompanies = false;
      }
    );
}


getLatestCandidates(): void {
  this.isLoadingCandidates = true;

  const params = new HttpParams()
    .set('page', this.currentCandidatePage.toString())
    .set('per_page', this.candidatesPerPage.toString());

  this.http.get<any>(`${CONFIG.apiUrl}/candidate/get_all_candidates-for_website`, { params })
    .subscribe(
      (response) => {
        this.candidates = response.data; // 🔄 Écrase à chaque fois
        this.currentCandidatePage = response.current_page;
        this.totalCandidatePages = response.pages;
        this.totalCandidateItems = response.total;
        this.isLoadingCandidates = false;
      },
      (error: any) => {
        this.toastr.error('Erreur lors du chargement des candidats');
        this.isLoadingCandidates = false;
      }
    );
}

loadMoreCompanies(): void {
  if (this.currentCompanyPage < this.totalCompanyPages) {
    this.currentCompanyPage++;
    this.getActivateCompanies();
  }
}

}
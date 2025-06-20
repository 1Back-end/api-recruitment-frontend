
import {NavbarComponent } from '../components/navbar/navbar.component';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { HttpClient ,HttpParams} from '@angular/common/http';  // Import HttpClient
import { CONFIG } from '../../../config';
import { FormsModule } from '@angular/forms'; 
import { parsePhoneNumberFromString } from 'libphonenumber-js';
import {RoleService } from '../services/role.service';
import { ElementRef, ViewChild, Inject, PLATFORM_ID } from '@angular/core';
import { AuthService } from '../services/auth.service';
@Component({
  selector: 'app-job-offers',
  imports: [CommonModule, RouterLink, ReactiveFormsModule, FormsModule,NavbarComponent],
  templateUrl: './job-offers.component.html',
  styleUrl: './job-offers.component.css'
})
export class JobOffersComponent {


  
  data: any[] = [];
  isLoading: boolean = false;
  currentPage: number = 1;
  totalPages: number = 0;
  titlesPerPage: number = 25;
  searchQuery: string = '';
  exportUrl: string = '';
  totalItems: number = 0;
  direction: { [key: string]: 'asc' | 'desc' } = {}; // pour le tri par colonne
  isEditMode = false;
  current_uuid: string | null = null;

 
  serviceToDelete: any;
  selectedCandidate: any = null;
  isLoadingCV: boolean = false;
   isAuthenticated = false;

  constructor(
    private http: HttpClient,
    private fb: FormBuilder, 
    private toastr: ToastrService,
    public role: RoleService,
    public authService: AuthService, // public au lieu de private
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {
    
  }
  formatPhoneNumberIntl(phone: string): string {
  const phoneNumber = parsePhoneNumberFromString(phone);
  return phoneNumber ? phoneNumber.formatInternational() : phone;
}
formatE164(phone: string): string {
  const phoneNumber = parsePhoneNumberFromString(phone, 'CM'); // par défaut Cameroun
  return phoneNumber ? phoneNumber.format('E.164') : phone;
}

  ngOnInit(): void {
    this.get_all_job_offers(); // Charger les utilisateurs au démarrage
     this.isAuthenticated = !!this.authService.getToken();
  }


  get_all_job_offers(): void {
    this.isLoading = true;

    let params = new HttpParams()
      .set('page', this.currentPage.toString())
      .set('per_page', this.titlesPerPage.toString());
    this.http.get<any>(`${CONFIG.apiUrl}/offers/get_many`, { params }).subscribe(
      (response) => {
        this.data = [...this.data, ...response.data]; // Ajoute les nouveaux résultats
        this.currentPage = response.current_page;
        this.totalPages = response.pages;
        this.totalItems = response.total;
        this.isLoading = false;
        console.log(this.data);
      },
      (error:any) => {
        this.toastr.error('Erreur lors du chargement des données');
        this.isLoading = false;
      }
    );
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.get_all_job_offers(); // conserver le filtre
  }

  loadMore(): void {
  if (this.currentPage < this.totalPages) {
    this.currentPage++;
    this.get_all_job_offers();
  }
}

applyToOffer(offerUuid: string): void {
  // logique pour postuler, ex: redirection ou appel API
  this.toastr.success("Postuler à l'offre :", offerUuid);
  // ...
}

showAuthAlert(): void {
  this.toastr.error("Vous devez être connecté en tant que candidat pour postuler à cette offre d'emploi.");
}

}

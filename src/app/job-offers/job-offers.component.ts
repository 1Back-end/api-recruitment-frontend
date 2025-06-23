
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
  selectedOffer: any = null;

  ApplicationForm!: FormGroup;
  selectedOfferUuid: string = '';
  cvUuid: string | null = null;
  coverLetterUuid: string | null = null;
  cvError = '';
  coverLetterError = '';

  constructor(
    private http: HttpClient,
    private fb: FormBuilder, 
    private toastr: ToastrService,
    public role: RoleService,
    public authService: AuthService, // public au lieu de private
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {

    this.ApplicationForm = this.fb.group({
    job_offer_uuid: ['',Validators.required],
    cv_uuid: ['', Validators.required],
    cover_letter_uuid: ['', Validators.required]
  });
    
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


  get_all_job_offers(keyword?: string): void {
    this.isLoading = true;

    let params = new HttpParams()
      .set('page', this.currentPage.toString())
      .set('per_page', this.titlesPerPage.toString());

      if (keyword && keyword.trim() !== '') {
        params = params.set('keyword', keyword.trim());
      }
    this.http.get<any>(`${CONFIG.apiUrl}/offers/get_many`, { params }).subscribe(
      (response) => {
        this.data = this.currentPage === 1 ? response.data : [...this.data, ...response.data];
        this.currentPage = response.current_page;
        this.totalPages = response.pages;
        this.totalItems = response.total;
        this.isLoading = false;
        // console.log(this.data);
      },
      (error:any) => {
        this.toastr.error('Erreur lors du chargement des données');
        this.isLoading = false;
      }
    );
  }

   onSearchChange(): void {
    this.currentPage = 1;
    this.get_all_job_offers(this.searchQuery);
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

openApplicationModal(offer: any): void {
  this.selectedOfferUuid = offer.uuid;
  this.ApplicationForm.patchValue({ job_offer_uuid: offer.uuid });
}

onFileSelected(event: any, type: 'cv' | 'coverLetter') {
  const file: File = event.target.files[0];
  if (!file) return;

  // Optional: validation sur le type/fichier
  if (!['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(file.type)) {
    if (type === 'cv') this.cvError = 'Format de fichier invalide (PDF, DOC, DOCX seulement)';
    else this.coverLetterError = 'Format de fichier invalide (PDF, DOC, DOCX seulement)';
    return;
  } else {
    if (type === 'cv') this.cvError = '';
    else this.coverLetterError = '';
  }

  const formData = new FormData();
  formData.append('file', file);

  this.isLoading = true;

  this.http.post<any>(`${CONFIG.apiUrl}/storages/upload`, formData).subscribe({
    next: (res) => {
      this.isLoading = false;
      if (type === 'cv') this.cvUuid = res.uuid;
      else this.coverLetterUuid = res.uuid;
    },
    error: () => {
      this.isLoading = false;
      if (type === 'cv') this.cvError = "Erreur lors de l'upload du CV";
      else this.coverLetterError = "Erreur lors de l'upload de la lettre";
    }
  });
}

submitApplication(): void {
  if (!this.cvUuid || !this.coverLetterUuid || this.isLoading) return;

  this.isLoading = true;

  const payload = {
    job_offer_uuid: this.selectedOfferUuid,
    cv_uuid: this.cvUuid,
    cover_letter_uuid: this.coverLetterUuid
  };

  this.http.post(`${CONFIG.apiUrl}/applications/create`, payload).subscribe({
    next: (res:any) => {
      this.toastr.success(res.message || 'Candidature envoyée avec succès');
      this.isLoading = false;
      this.cvUuid = null;
      this.coverLetterUuid = null;
      this.ApplicationForm.reset();
    },
    error: (err) => {
      this.toastr.error(err.error.detail || "Erreur lors de l'envoi");
      this.isLoading = false;
    }
  });
}


showAuthAlert(): void {
  this.toastr.error("Vous devez être connecté en tant que candidat pour postuler à cette offre d'emploi.");
}

}

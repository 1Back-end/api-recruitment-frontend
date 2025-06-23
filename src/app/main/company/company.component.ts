import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { HttpClient ,HttpParams} from '@angular/common/http';  // Import HttpClient
import { CONFIG } from '../../../../config';
import { FormsModule } from '@angular/forms'; 
import { parsePhoneNumberFromString } from 'libphonenumber-js';
@Component({
  selector: 'app-company',
  imports: [CommonModule, RouterLink, ReactiveFormsModule, FormsModule],
  templateUrl: './company.component.html',
  styleUrl: './company.component.css'
})
export class CompanyComponent {

  data: any[] = [];
  isLoading: boolean = false;
  currentPage: number = 1;
  totalPages: number = 0;
  titlesPerPage: number = 25;
  searchQuery: string = '';
  exportUrl: string = '';
  totalItems: number = 0;
  direction: { [key: string]: 'asc' | 'desc' } = {}; // pour le tri par colonne
  selectedStatus: string = '';
  selectedCompany: any = null;
  isDeleting: boolean = false;
  isFiltering: boolean = false;


  
  constructor(private http: HttpClient, private toastr: ToastrService) {}

  formatPhoneNumberIntl(phone: string): string {
    const phoneNumber = parsePhoneNumberFromString(phone);
    return phoneNumber ? phoneNumber.formatInternational() : phone;
  }
  formatE164(phone: string): string {
    const phoneNumber = parsePhoneNumberFromString(phone, 'CM'); // par défaut Cameroun
    return phoneNumber ? phoneNumber.format('E.164') : phone;
  }

  ngOnInit(): void {
    this.get_all_company(); // Charger les utilisateurs au démarrage
  }

  
  get_all_company(status?: string): void {
    this.isLoading = true;

    let params = new HttpParams()
      .set('page', this.currentPage.toString())
      .set('per_page', this.titlesPerPage.toString());
    if (status) {
      params = params.set('status', status);
    }

    this.http.get<any>(`${CONFIG.apiUrl}/company/get_many/auth`, { params }).subscribe(
      (response) => {
        this.data = response.data;
        this.currentPage = response.current_page;
        this.totalPages = response.pages;
        this.totalItems = response.total;
        this.isLoading = false;
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
    this.get_all_company(this.selectedStatus); // conserver le filtre
  }

  searchQueryData(): void {
    this.currentPage = 1; // remettre à la première page lors d'une recherche
    this.get_all_company(this.selectedStatus);
  }


  openCompanyDetails(company: any): void {
  this.selectedCompany = company;
  this.selectedStatus = '';
}

  changeStatus(uuid: string): void {
    if (!this.selectedStatus || !uuid) return;
    this.isLoading = true;

    const url = `${CONFIG.apiUrl}/company/update_status/auth?status=${this.selectedStatus}`;
    const payload = { uuid };

    this.http.put(url, payload).subscribe({
      next: (res: any) => {
        this.toastr.success(res.message);
        this.selectedStatus = '';
        this.get_all_company(); // recharger les données
        this.isLoading = false;
      },
      error: (error: any) => {
        const message = error?.error?.detail;
        this.toastr.error(message);
        this.isLoading = false;
      }
    });
  }

  deleteCompany(): void {
  if (!this.selectedCompany?.uuid) return;
  this.isDeleting = true;
  const url = `${CONFIG.apiUrl}/company/soft_delete/auth`;
  const payload = { uuid: this.selectedCompany.uuid };

  this.http.put(url, payload).subscribe({
    next: (res: any) => {
      this.toastr.success(res.message || "Entreprise supprimée avec succès");
      this.isDeleting = false;
      this.get_all_company(); // recharge la liste
    },
    error: (err: any) => {
      this.toastr.error(err?.error?.detail || "Une erreur est survenue");
      this.isDeleting = false;
    }
  });
}


  



}

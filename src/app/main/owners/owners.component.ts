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
  selector: 'app-owners',
  imports: [CommonModule, RouterLink, ReactiveFormsModule, FormsModule],
  templateUrl: './owners.component.html',
  styleUrl: './owners.component.css'
})
export class OwnersComponent {


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
  selectedOwner: any = null;
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
    this.get_all_owners(); // Charger les utilisateurs au démarrage
  }

  
  get_all_owners(status?: string): void {
    this.isLoading = true;

    let params = new HttpParams()
      .set('page', this.currentPage.toString())
      .set('per_page', this.titlesPerPage.toString());

    if (status) {
      params = params.set('status', status);
    }

    this.http.get<any>(`${CONFIG.apiUrl}/owners/get_many`, { params }).subscribe(
      (response) => {
        this.data = response.data;
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

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.get_all_owners(this.selectedStatus); // conserver le filtre
  }

  searchQueryData(): void {
    this.currentPage = 1; // remettre à la première page lors d'une recherche
    this.get_all_owners(this.selectedStatus);
  }


  openOwnersDetails(owner: any): void {
  this.selectedOwner = owner;
  // console.log(owner)
  this.selectedStatus = '';
}

  changeStatus(uuid: string): void {
    if (!this.selectedStatus || !uuid) return;
    this.isLoading = true;

    const url = `${CONFIG.apiUrl}/owners/update-owner-status?status=${this.selectedStatus}`;
    const payload = { uuid };

    this.http.put(url, payload).subscribe({
      next: (res: any) => {
        this.toastr.success(res.message);
        this.selectedStatus = '';
        this.get_all_owners(); // recharger les données
        this.isLoading = false;
      },
      error: (error: any) => {
        const message = error?.error?.detail;
        this.toastr.error(message);
        this.isLoading = false;
      }
    });
  }

  deleteOwners(): void {
  if (!this.selectedOwner?.uuid) return;
  this.isDeleting = true;
  const url = `${CONFIG.apiUrl}/owners/soft_delete`;
  const payload = { uuid: this.selectedOwner.uuid };

  this.http.put(url, payload).subscribe({
    next: (res: any) => {
      this.toastr.success(res.message);
      this.isDeleting = false;
      this.get_all_owners(); // recharge la liste
    },
    error: (err: any) => {
      this.toastr.error(err?.error?.detail || "Une erreur est survenue");
      this.isDeleting = false;
    }
  });
}


  




}

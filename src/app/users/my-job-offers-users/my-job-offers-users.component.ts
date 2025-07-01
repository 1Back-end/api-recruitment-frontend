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
  selector: 'app-my-job-offers-users',
  imports: [CommonModule, RouterLink, ReactiveFormsModule, FormsModule],
  templateUrl: './my-job-offers-users.component.html',
  styleUrl: './my-job-offers-users.component.css'
})
export class MyJobOffersUsersComponent {

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

  ServiceForm: FormGroup; 
  serviceToDelete: any;

  constructor(private http: HttpClient,private fb: FormBuilder, private toastr: ToastrService) {4
    this.ServiceForm = this.fb.group({
      degree_name : ['',Validators.required],
      institution_name : ['',Validators.required],
      address : ['',Validators.required],
      start_year : ['',Validators.required],
      end_year : ['',Validators.required]

    })
  }

  ngOnInit(): void {
    this.get_my_offers(); // Charger les utilisateurs au démarrage
  }


  get_my_offers(): void {
    this.isLoading = true;

    let params = new HttpParams()
      .set('page', this.currentPage.toString())
      .set('per_page', this.titlesPerPage.toString());
    this.http.get<any>(`${CONFIG.apiUrl}/candidate/get-my-job-offers`, { params }).subscribe(
      (response) => {
        this.data = response.data;
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
    this.get_my_offers(); // conserver le filtre
  }


}

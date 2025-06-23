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
  selector: 'app-my-candidates',
  imports: [CommonModule, RouterLink, ReactiveFormsModule, FormsModule],
  templateUrl: './my-candidates.component.html',
  styleUrl: './my-candidates.component.css'
})
export class MyCandidatesComponent {

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

  selectedStatus: string = '';
  selectedJob: any = null;

  constructor(private http: HttpClient,private fb: FormBuilder, private toastr: ToastrService) {4
    this.ServiceForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      currency: ['XAF', Validators.required],
      salary: [null, [Validators.required, Validators.min(0)]],
      employment_type: ['', Validators.required],
      requirements: ['', Validators.required],
      expiration_date: ['', Validators.required],
      work_mode: ['', Validators.required],
      contact_email: ['', [Validators.required, Validators.email]],
    });
  }

  ngOnInit(): void {
    this.get_all_my_candidates(); // Charger les utilisateurs au démarrage
  }


  get_all_my_candidates(): void {
    this.isLoading = true;

    let params = new HttpParams()
      .set('page', this.currentPage.toString())
      .set('per_page', this.titlesPerPage.toString());
    this.http.get<any>(`${CONFIG.apiUrl}/applications/get_all_my_candidats`, { params }).subscribe(
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
    this.get_all_my_candidates(); // conserver le filtre
  }




}

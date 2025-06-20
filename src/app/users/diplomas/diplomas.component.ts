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
  selector: 'app-diplomas',
  imports: [CommonModule, RouterLink, ReactiveFormsModule, FormsModule],
  templateUrl: './diplomas.component.html',
  styleUrl: './diplomas.component.css'
})
export class DiplomasComponent {

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
    this.get_diplomas(); // Charger les utilisateurs au démarrage
  }


  get_diplomas(): void {
    this.isLoading = true;

    let params = new HttpParams()
      .set('page', this.currentPage.toString())
      .set('per_page', this.titlesPerPage.toString());
    this.http.get<any>(`${CONFIG.apiUrl}/candidate/get-my-diplomas`, { params }).subscribe(
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
    this.get_diplomas(); // conserver le filtre
  }


  SaveDiplomas() :void{
    if (this.ServiceForm.invalid || this.isLoading) return;

    this.isLoading = true;
    const formData = { ...this.ServiceForm.value };
    if (this.isEditMode) formData.uuid = this.current_uuid;

    const url = this.isEditMode 
    ? `${CONFIG.apiUrl}/candidate/update-diplomas` 
    : `${CONFIG.apiUrl}/candidate/create-diplomas`;

    const request = this.isEditMode 
      ? this.http.put<any>(url, formData) 
      : this.http.post<any>(url, formData);

    request.subscribe({
      next: response => {
        this.toastr.success(response.message, 'Succès');
        this.get_diplomas();
        this.isEditMode = false;
      },
      error: (error) => {
        const message = error?.error?.detail || "Une erreur est survenue.";
        this.toastr.error(message, 'Erreur');
      },
      complete: () => this.isLoading = false
    });

  }

  onEdit(service: any): void {
    // console.log(service);
    this.isEditMode = true;
    this.current_uuid = service.uuid;
    this.http.get<any>(`${CONFIG.apiUrl}/candidate/get_diplomas_by_uuid?uuid=${this.current_uuid}`)
      .subscribe({
        next: (data) => {
          // console.log(data);
          this.ServiceForm.patchValue({
            degree_name: data.degree_name || '',
            institution_name: data.institution_name || '',
            address: data.address || '',
            start_year: data.start_year || '',
            end_year: data.end_year || ''
          });
        },
        error: (err) => {
          this.toastr.error('Erreur lors de la récupération des données :', err);
        }
      });
  }

  openDeleteModal(service: any): void {
    this.serviceToDelete = service;
    // console.log(service)
  }

  deleteDiploma(uuid: string): void {
  const body = { uuid };
  this.http.put<any>(`${CONFIG.apiUrl}/candidate/delete-diplomas`, body)
    .subscribe(
      (response) => {
        this.toastr.success(response?.message);
        this.get_diplomas();
      },
      (error) => {
        const message = error?.error?.detail || 'Erreur lors de la suppression';
        this.toastr.error(message);
      }
    );
}


}

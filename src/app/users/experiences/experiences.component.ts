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
  selector: 'app-experiences',
 imports: [CommonModule, RouterLink, ReactiveFormsModule, FormsModule],
  templateUrl: './experiences.component.html',
  styleUrl: './experiences.component.css'
})
export class ExperiencesComponent {

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

  ExperienceForm: FormGroup; 
  serviceToDelete: any;

  constructor(private http: HttpClient,private fb: FormBuilder, private toastr: ToastrService) {4
    this.ExperienceForm = this.fb.group({
      job_title : ['',Validators.required],
      company_name : ['',Validators.required],
      description : ['',Validators.required],
      start_date : ['',Validators.required],
      end_date : ['',Validators.required]

    })
  }

  ngOnInit(): void {
    this.get_my_experiences(); // Charger les utilisateurs au démarrage
  }


  get_my_experiences(): void {
    this.isLoading = true;

    let params = new HttpParams()
      .set('page', this.currentPage.toString())
      .set('per_page', this.titlesPerPage.toString());
    this.http.get<any>(`${CONFIG.apiUrl}/candidate/get-my-experiences`, { params }).subscribe(
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
    this.get_my_experiences(); // conserver le filtre
  }


  SaveExperiences() :void{
    if (this.ExperienceForm.invalid || this.isLoading) return;

    this.isLoading = true;
    const formData = { ...this.ExperienceForm.value };
    if (this.isEditMode) formData.uuid = this.current_uuid;

    const url = this.isEditMode 
    ? `${CONFIG.apiUrl}/candidate/update-my-experiences` 
    : `${CONFIG.apiUrl}/candidate/create-my-experiences`;

    const request = this.isEditMode 
      ? this.http.put<any>(url, formData) 
      : this.http.post<any>(url, formData);

    request.subscribe({
      next: response => {
        this.toastr.success(response.message, 'Succès');
        this.get_my_experiences();
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
    this.http.get<any>(`${CONFIG.apiUrl}/candidate/get-experiences-by-uuid?uuid=${this.current_uuid}`)
      .subscribe({
        next: (data) => {
          // console.log(data);
          this.ExperienceForm.patchValue({
            job_title: data.job_title || '',
            company_name: data.company_name || '',
            description: data.description || '',
            start_date: data.start_date || '',
            end_date: data.end_date || ''
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

  deleteExperiences(uuid: string): void {
  const body = { uuid };
  this.http.put<any>(`${CONFIG.apiUrl}/candidate/delete-experiences`, body)
    .subscribe(
      (response) => {
        this.toastr.success(response?.message);
        this.get_my_experiences();
      },
      (error) => {
        const message = error?.error?.detail || 'Erreur lors de la suppression';
        this.toastr.error(message);
      }
    );
}


}

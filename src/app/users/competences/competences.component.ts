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
  selector: 'app-competences',
  imports: [CommonModule, RouterLink, ReactiveFormsModule, FormsModule],
  templateUrl: './competences.component.html',
  styleUrl: './competences.component.css'
})
export class CompetencesComponent {
  
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
      title : ['',Validators.required],
      level : ['',Validators.required],
      description : [null],
      is_certified : [false]

    })
  }

  ngOnInit(): void {
    this.get_my_competences(); // Charger les utilisateurs au démarrage
  }


  get_my_competences(): void {
    this.isLoading = true;

    let params = new HttpParams()
      .set('page', this.currentPage.toString())
      .set('per_page', this.titlesPerPage.toString());
    this.http.get<any>(`${CONFIG.apiUrl}/competences/get-my-competences`, { params }).subscribe(
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
    this.get_my_competences(); // conserver le filtre
  }


  SaveCompetences() :void{
    if (this.ServiceForm.invalid || this.isLoading) return;

    this.isLoading = true;
    const formData = { 
      ...this.ServiceForm.value,
      is_certificate : this.ServiceForm.value.is_certificate ? '1' : '0',
     };
    if (this.isEditMode) formData.uuid = this.current_uuid;

    const url = this.isEditMode 
    ? `${CONFIG.apiUrl}/competences/update` 
    : `${CONFIG.apiUrl}/competences/create`;

    const request = this.isEditMode 
      ? this.http.put<any>(url, formData) 
      : this.http.post<any>(url, formData);

    request.subscribe({
      next: response => {
        this.toastr.success(response.message, 'Succès');
        this.get_my_competences();
        this.ServiceForm.reset();
        this.isEditMode = false;
      },
      error: (error) => {
        const message = error?.error?.detail || "Une erreur est survenue.";
        this.toastr.error(message, 'Erreur');
      },
      complete: () => this.isLoading = false
    });

  }

  onEdit(competence: any): void {
    this.isLoading = true;
    this.isEditMode = true;
    this.current_uuid = competence.uuid;
    this.http.get<any>(`${CONFIG.apiUrl}/competences/get_competences_by_uuid?uuid=${this.current_uuid}`)
      .subscribe({
        next: (data) => {
          // console.log(data);
          this.ServiceForm.patchValue({
            title: data.title || '',
            description: data.description || '',
            level : data.level || '',
            is_certified: data.is_certified === true || data.is_certified === 1
          });
          this.isLoading = false;
        },
        error: (error:any) => {
          const message = error?.error?.detail || "Une erreur est survenue.";
          this.toastr.error(message, 'Erreur');
          this.isLoading = false;
        }
      });
  }

  openDeleteModal(competence: any): void {
    this.serviceToDelete = competence;
    // console.log(service)
  }

  deleteCompetences(uuid: string): void {
  const body = { uuid };
  this.http.put<any>(`${CONFIG.apiUrl}/competences/soft_delete`, body)
    .subscribe(
      (response) => {
        this.toastr.success(response?.message);
        this.get_my_competences();
      },
      (error) => {
        const message = error?.error?.detail || 'Erreur lors de la suppression';
        this.toastr.error(message);
      }
    );
}


}

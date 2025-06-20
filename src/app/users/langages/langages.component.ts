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
  selector: 'app-langages',
  imports: [CommonModule, RouterLink, ReactiveFormsModule, FormsModule],
  templateUrl: './langages.component.html',
  styleUrl: './langages.component.css'
})
export class LangagesComponent {

  
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
    this.get_all_languages(); // Charger les utilisateurs au démarrage
  }


  get_all_languages(): void {
    this.isLoading = true;

    let params = new HttpParams()
      .set('page', this.currentPage.toString())
      .set('per_page', this.titlesPerPage.toString());
    this.http.get<any>(`${CONFIG.apiUrl}/languages/get-my-languages`, { params }).subscribe(
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
    this.get_all_languages(); // conserver le filtre
  }

  getNiveauLabel(level: string): string {
    switch (level) {
      case 'BASIQUE':
        return 'Basique';
      case 'INTERMEDIAIRE':
        return 'Intermédiaire';
      case 'ELEVE':
        return 'Élevé';
      default:
        return level;
    }
  }


  SaveLanguages() :void{
    if (this.ServiceForm.invalid || this.isLoading) return;

    this.isLoading = true;
    const formData = { 
      ...this.ServiceForm.value,
      is_certificate : this.ServiceForm.value.is_certificate ? '1' : '0',
     };
    if (this.isEditMode) formData.uuid = this.current_uuid;

    const url = this.isEditMode 
    ? `${CONFIG.apiUrl}/languages/update` 
    : `${CONFIG.apiUrl}/languages/create`;

    const request = this.isEditMode 
      ? this.http.put<any>(url, formData) 
      : this.http.post<any>(url, formData);

    request.subscribe({
      next: response => {
        this.toastr.success(response.message, 'Succès');
        this.get_all_languages();
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

  onEdit(language: any): void {
    // console.log(service);
    this.isEditMode = true;
    this.current_uuid = language.uuid;
    this.http.get<any>(`${CONFIG.apiUrl}/languages/get_languages_by_uuid?uuid=${this.current_uuid}`)
      .subscribe({
        next: (data) => {
          // console.log(data);
          this.ServiceForm.patchValue({
            title: data.title || '',
            description: data.description || '',
            level : data.level || '',
            is_certified: data.is_certified === true || data.is_certified === 1
          });
        },
        error: (err) => {
          this.toastr.error('Erreur lors de la récupération des données :', err);
        }
      });
  }

  openDeleteModal(language: any): void {
    this.serviceToDelete = language;
    // console.log(service)
  }

  deletelanguages(uuid: string): void {
  const body = { uuid };
  this.http.put<any>(`${CONFIG.apiUrl}/languages/soft_delete`, body)
    .subscribe(
      (response) => {
        this.toastr.success(response?.message);
        this.get_all_languages();
      },
      (error) => {
        const message = error?.error?.detail || 'Erreur lors de la suppression';
        this.toastr.error(message);
      }
    );
}



}

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
  selector: 'app-others',
  imports: [CommonModule, RouterLink, ReactiveFormsModule, FormsModule],
  templateUrl: './others.component.html',
  styleUrl: './others.component.css'
})
export class OthersComponent {


  
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

  personalForm: FormGroup; 
  serviceToDelete: any;

  constructor(private http: HttpClient,private fb: FormBuilder, private toastr: ToastrService) {4
    this.personalForm = this.fb.group({
      gender: [''],
      professional_title: [''],
      title_description: [''],
      birth_date: [''],
      place_of_birth: [''],
      region_of_origin: [''],
      adress: [''],
      nationality: [''],
      city: [''],
      country: [''],
      others: ['']
    });
  }

  ngOnInit(): void {
    this.get_all_informations(); // Charger les utilisateurs au démarrage
  }


  get_all_informations(): void {
    this.isLoading = true;

    let params = new HttpParams()
      .set('page', this.currentPage.toString())
      .set('per_page', this.titlesPerPage.toString());
    this.http.get<any>(`${CONFIG.apiUrl}/personals/get-my-personals`, { params }).subscribe(
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
    this.get_all_informations(); // conserver le filtre
  }

savePersonals(): void {
  const payload = this.personalForm.value;
  this.isLoading = true;
  this.http.post<any>(`${CONFIG.apiUrl}/personals/save`, payload).subscribe({
    next: (res) => {
      this.isLoading = false;
      // ✅ Message de succès
      this.toastr.success('Informations personnelles enregistrées avec succès');
      this.get_all_informations(); // recharge les infos si besoin
    },
    error: (err) => {
      this.isLoading = false;
      this.toastr.error("Une erreur s'est produite !");
      console.error(err);
    }
  });
}


  openUpdateModal() {
  this.http.get<any>(`${CONFIG.apiUrl}/personals/get_personals_by_candidat_uuid`)
    .subscribe({
      next: (res) => {
        console.log(res)
        this.personalForm.patchValue({
          gender: res.gender || '',
          professional_title: res.professional_title || '',
          title_description: res.title_description || '',
          birth_date: res.birth_date?.split('T')[0] || '',
          place_of_birth: res.place_of_birth || '',
          region_of_origin: res.region_of_origin || '',
          adress: res.adress || '',
          nationality: res.nationality || '',
          city: res.city || '',
          country: res.country || '',
          others: res.others || ''
        });
      },
      error: (err) => {
        this.toastr.error('Erreur lors du chargement des données');
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
        this.get_all_informations();
      },
      (error) => {
        const message = error?.error?.detail || 'Erreur lors de la suppression';
        this.toastr.error(message);
      }
    );
}

CVData(){
  
}



}

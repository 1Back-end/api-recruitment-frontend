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
  selector: 'app-hobbies',
  imports: [CommonModule, RouterLink, ReactiveFormsModule, FormsModule],
  templateUrl: './hobbies.component.html',
  styleUrl: './hobbies.component.css'
})
export class HobbiesComponent {
   
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
      description : [null],

    })
  }

  ngOnInit(): void {
    this.get_all_hobbies(); // Charger les utilisateurs au démarrage
  }


  get_all_hobbies(): void {
    this.isLoading = true;

    let params = new HttpParams()
      .set('page', this.currentPage.toString())
      .set('per_page', this.titlesPerPage.toString());
    this.http.get<any>(`${CONFIG.apiUrl}/hobbies/get-my-hobbies`, { params }).subscribe(
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
    this.get_all_hobbies(); // conserver le filtre
  }

  


  SaveHobbies() :void{
    if (this.ServiceForm.invalid || this.isLoading) return;

    this.isLoading = true;
    const formData = this.ServiceForm.value;

    if (this.isEditMode) formData.uuid = this.current_uuid;

    const url = this.isEditMode 
    ? `${CONFIG.apiUrl}/hobbies/update` 
    : `${CONFIG.apiUrl}/hobbies/create`;

    const request = this.isEditMode 
      ? this.http.put<any>(url, formData) 
      : this.http.post<any>(url, formData);

    request.subscribe({
      next: response => {
        this.toastr.success(response.message, 'Succès');
        this.get_all_hobbies();
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

  onEdit(hobbies: any): void {
    // console.log(service);
    this.isEditMode = true;
    this.current_uuid = hobbies.uuid;
    this.http.get<any>(`${CONFIG.apiUrl}/hobbies/get_hobbies_by_uuid?uuid=${this.current_uuid}`)
      .subscribe({
        next: (data) => {
          // console.log(data);
          this.ServiceForm.patchValue({
            title: data.title || '',
            description: data.description || '',
          });
        },
        error: (err) => {
          this.toastr.error('Erreur lors de la récupération des données :', err);
        }
      });
  }

  openDeleteModal(hobbies: any): void {
    this.serviceToDelete = hobbies;
    // console.log(service)
  }

  deleteHobbies(uuid: string): void {
  const body = { uuid };
  this.http.put<any>(`${CONFIG.apiUrl}/hobbies/soft_delete`, body)
    .subscribe(
      (response) => {
        this.toastr.success(response?.message);
        this.get_all_hobbies();
      },
      (error) => {
        const message = error?.error?.detail || 'Erreur lors de la suppression';
        this.toastr.error(message);
      }
    );
}

}

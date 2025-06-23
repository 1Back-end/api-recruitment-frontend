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
  selector: 'app-my-job-offers',
  imports: [CommonModule, RouterLink, ReactiveFormsModule, FormsModule],
  templateUrl: './my-job-offers.component.html',
  styleUrl: './my-job-offers.component.css'
})
export class MyJobOffersComponent {


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
    this.get_all_my_job_offers(); // Charger les utilisateurs au démarrage
  }


  get_all_my_job_offers(): void {
    this.isLoading = true;

    let params = new HttpParams()
      .set('page', this.currentPage.toString())
      .set('per_page', this.titlesPerPage.toString());
    this.http.get<any>(`${CONFIG.apiUrl}/offers/get-my-job-offers`, { params }).subscribe(
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
    this.get_all_my_job_offers(); // conserver le filtre
  }
 

  translateContractType(type: string): string {
  switch (type) {
    case 'CDI': return 'Contrat à durée indéterminée';
    case 'CDD': return 'Contrat à durée déterminée';
    case 'Freelance': return 'Freelance';
    case 'Internship': return 'Stage';
    default: return 'Inconnu';
  }
}

onEdit(service: any): void {
  this.isEditMode = true;
  this.current_uuid = service.uuid;

  this.http.get<any>(`${CONFIG.apiUrl}/offers/get_job_offers_by_uuid?uuid=${this.current_uuid}`)
    .subscribe({
      next: (data) => {
        this.ServiceForm.patchValue({
          title: data.title,
          description: data.description,
          currency: data.currency,
          salary: data.salary,
          employment_type: data.employment_type,
          requirements: data.requirements,
          expiration_date: data.expiration_date,
          work_mode: data.work_mode,
          contact_email: data.contact_email
        });
      },
      error: (err) => {
        console.error(err);
        this.toastr.error('Erreur lors de la récupération des données.');
      }
    });
}


SaveJobOffers():void{

  if (this.ServiceForm.invalid || this.isLoading) return;

    this.isLoading = true;
    const formData = { ...this.ServiceForm.value };
    if (this.isEditMode) formData.uuid = this.current_uuid;

    const url = this.isEditMode 
    ? `${CONFIG.apiUrl}/offers/update` 
    : `${CONFIG.apiUrl}/offers/create`;

    const request = this.isEditMode 
      ? this.http.put<any>(url, formData) 
      : this.http.post<any>(url, formData);

    request.subscribe({
      next: response => {
        this.toastr.success(response.message, 'Succès');
        this.get_all_my_job_offers();
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

 openJobDetails(job_offers: any): void {
  this.selectedJob = job_offers;
  this.selectedStatus = '';
}

 changeStatus(uuid: string): void {
    if (!this.selectedStatus || !uuid) return;
    this.isLoading = true;

    const url = `${CONFIG.apiUrl}/offers/update-status?status=${this.selectedStatus}`;
    const payload = { uuid };

    this.http.put(url, payload).subscribe({
      next: (res: any) => {
        this.toastr.success(res.message);
        this.selectedStatus = '';
        this.get_all_my_job_offers(); // recharger les données
        this.isLoading = false;
      },
      error: (error: any) => {
        const message = error?.error?.detail;
        this.toastr.error(message);
        this.isLoading = false;
      }
    });
  }


}

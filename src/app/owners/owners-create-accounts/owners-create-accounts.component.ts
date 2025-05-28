import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import {NavbarComponent } from '../../components/navbar/navbar.component';
import { AngularPhoneNumberInput } from 'angular-phone-number-input';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { HttpClient ,HttpParams} from '@angular/common/http';  // Import HttpClient
import { CONFIG } from '../../../../config';
import { FormsModule } from '@angular/forms'; 
import { firstValueFrom } from 'rxjs/internal/firstValueFrom';
import { finalize } from 'rxjs/operators';
import { Location } from '@angular/common';

@Component({
  selector: 'app-owners-create-accounts',
  imports: [RouterLink, NavbarComponent,AngularPhoneNumberInput,ReactiveFormsModule,CommonModule,FormsModule],
  templateUrl: './owners-create-accounts.component.html',
  styleUrl: './owners-create-accounts.component.css'
})
export class OwnersCreateAccountsComponent {

  filePreview: string | ArrayBuffer | null = null;
  selectedFile: File | null = null;
  ServiceForm : FormGroup;
  isLoading: boolean = false;

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
  
      // Générer un aperçu de l’image
      const reader = new FileReader();
      reader.onload = () => {
        this.filePreview = reader.result;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }
  
  removeFile() {
    this.selectedFile = null;
    this.filePreview = null;
  }
  constructor(private fb: FormBuilder, private toastr: ToastrService,private http: HttpClient,private location: Location) {
    this.ServiceForm = this.fb.group({
      name : ['',Validators.required],
      email : ['', Validators.required],
      phone : ['',Validators.required],
      zipcode : ['',Validators.required],
      city : ['',Validators.required],
      country : ['',Validators.required],
      slogan : ['',Validators.required],
      website : [],
      founded_at : ['',Validators.required],
      employee_count : ['',Validators.required],
      type : ['',Validators.required],
      description : ['',Validators.required],
      firstname : ['',Validators.required],
      lastname : ['',Validators.required],
      phone_number : ['',Validators.required],
      owner_email : ['',Validators.required],
      password_hash : ['',Validators.required,Validators.maxLength(12)],
      civility : ['',Validators.required],
      logo_uuid : [null],
    });
  }

  



 async onSubmit(): Promise<void> {
    if (this.ServiceForm.invalid || this.isLoading) return;
    this.isLoading = true; // Active le loading
  
    const formData = { ...this.ServiceForm.value, logo_uuid: null };

    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    const file = fileInput?.files?.[0];
  
    if (file) {
      const uploadForm = new FormData();
      uploadForm.append('file', file);
  
      console.log("Uploading image...");
  
      this.http.post<any>(`${CONFIG.apiUrl}/storages/upload`, uploadForm).subscribe({
        next: (uploadResponse) => {
          const logo_uuid = uploadResponse?.uuid; // 👈 correction ici
          if (logo_uuid) {
            formData.logo_uuid = logo_uuid;
            this.toastr.success("Logo téléchargée avec succès.");
          } else {
            this.toastr.warning("UUID manquant. Enregistrement sans image.");
          }
          this.createCompany(formData);
          
        },
        error: (err) => {
          console.error("Erreur upload image:", err);
          this.toastr.error("Erreur lors du téléchargement du logo.");
          // Tu peux commenter la ligne suivante si tu veux stopper tout si l’image échoue
          this.createCompany(formData);
        }
      });
    } else {
      // Pas d'image : envoyer directement
      this.createCompany(formData);
    }
  }
  
  createCompany(data: any): void {
  this.http.post<any>(`${CONFIG.apiUrl}/company/create`, data)
    .pipe(finalize(() => this.isLoading = false)) // ✅ stoppe le loading
    .subscribe({
      next: (response) => {
        this.toastr.success(response.message);
        this.location.back(); 
        this.ServiceForm.reset();
      },
      error: (error) => {
        const message = error?.error?.detail || "Erreur inconnue";
        this.toastr.error(message);
      }
    });
}
}
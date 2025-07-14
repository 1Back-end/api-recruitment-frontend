import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';
import { CONFIG } from '../../../config';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AngularPhoneNumberInput } from 'angular-phone-number-input';
@Component({
  selector: 'app-profile-users',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AngularPhoneNumberInput
  ],
  templateUrl: './profile-users.component.html',
  styleUrl: './profile-users.component.css'
})
export class ProfileUsersComponent {

  UserForm: FormGroup;
  selectedFile: File | null = null;
  filePreview: string | ArrayBuffer | null = null;
  fileUrl: string | null = null;
  isLoading: boolean = false;
  

  
  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private http: HttpClient,
    private router: Router,
  ) {
    this.UserForm = this.fb.group({
      last_name: [''],
      first_name: [''],
      email: [''],
      phone_number: [''],
      login: [''],
      avatar_uuid: [null]
    });
  }
  
  ngOnInit(): void {
    const token = JSON.parse(localStorage.getItem('token') || '{}')?.access_token;
  
    if (token) {
      this.http.get(`${CONFIG.apiUrl}/authentification/me/administrator`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }).subscribe((response: any) => {
        console.log('Réponse du serveur :', response); // <= ajoute ceci
        this.patchUserForm(response);
      }, error => {
        this.toastr.error("Erreur lors du chargement du profil.");
      });
    }
  }

  avatarStorageUuid: string | null = null; // À déclarer dans ta classe

  patchUserForm(data: any): void {
    console.log('Données utilisateur reçues:', data);
    this.avatarStorageUuid = data.avatar?.uuid || null;
      this.fileUrl = data.avatar?.url || null;
  
      console.log("UUID de l'avatar:", this.avatarStorageUuid);
      console.log("URL de l'avatar:", this.fileUrl);
    this.UserForm.patchValue({
      last_name: data.last_name || '',
      first_name: data.first_name || '',
      email: data.email || '',
      phone_number: data.phone_number || '',
      login: data.login || '',
      country_code: data.country_code || '',
      avatar_uuid: this.avatarStorageUuid // On met l'UUID ici, pas l'URL
    });
  
    
  }
  
  /* ---------- Upload avatar ---------- */
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!(input.files && input.files.length)) return;

    const selectedFile = input.files[0];
    const formData = new FormData();
    formData.append('file', selectedFile);

    const token = JSON.parse(localStorage.getItem('token') || '{}')?.access_token;

    this.isLoading = true;                   // ⏳ start load
    this.http.post(`${CONFIG.apiUrl}/storages/upload`, formData, {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe({
      next: (res: any) => {
        this.isLoading = false;              // ✅ end load
        if (res?.uuid) {
          this.avatarStorageUuid = res.uuid;
          this.fileUrl = res.url || null;
          this.filePreview = null;

          this.UserForm.patchValue({ avatar_uuid: this.avatarStorageUuid });
          this.toastr.success("Avatar téléchargé avec succès.");
        }
      },
      error: () => {
        this.isLoading = false;              // ❌ end load
        this.toastr.error("Échec du téléchargement de l'avatar.");
      }
    });
  }

  /* ---------- Supprimer avatar ---------- */
  removeFile(): void {
    this.selectedFile = null;
    this.fileUrl = null;
    this.filePreview = null;
    this.UserForm.get('avatar_uuid')?.setValue(null);
  }

 updateProfil(): void {
  if (this.UserForm.invalid || this.isLoading) return;

  const token = JSON.parse(localStorage.getItem('token') || '{}')?.access_token;

  if (!token) {
    this.toastr.error("Vous devez vous connecter pour modifier votre profil.");
    
  }
  this.isLoading = true;
  this.http.put(`${CONFIG.apiUrl}/authentification/me/update`, this.UserForm.value, {
    headers: { Authorization: `Bearer ${token}` }
  }).subscribe({
    next: (res: any) => {
      this.isLoading = false;
      this.toastr.success(res.message || "Profil mis à jour avec succès.");
      // Ne pas toucher au token ici !
    },
    error: (error) => {
      this.isLoading = false;
      this.toastr.error(error?.error?.detail || "Erreur lors de la mise à jour du profil.");
    }
  });
}


}

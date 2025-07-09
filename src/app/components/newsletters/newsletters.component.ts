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
  selector: 'app-newsletters',
  imports: [NavbarComponent,ReactiveFormsModule,CommonModule,FormsModule],
  templateUrl: './newsletters.component.html',
  styleUrl: './newsletters.component.css'
})
export class NewslettersComponent {
  ServiceForm : FormGroup;
  isLoading: boolean = false;

  constructor(private fb: FormBuilder, private toastr: ToastrService,private http: HttpClient,private location: Location) {
    this.ServiceForm = this.fb.group({
      email: ['', [Validators.required]],
     
    });
  }

  Save(): void{
    if (this.ServiceForm.invalid || this.isLoading) return;
      this.isLoading = true; // Active le loading
      const FormData = this.ServiceForm.value;
      this.http.post<any>(`${CONFIG.apiUrl}/subscribers/create`, FormData).subscribe(
    (response) => {
      this.toastr.success(response.message || 'Abonné créé avec succès');
      this.isLoading = false; // Stop loader
      this.ServiceForm.reset()
      this.location.back();
    },
    (error) => {
      const message = error?.error?.detail || "Erreur lors de l'abonnement";
      this.toastr.error(message);
      this.isLoading = false; // Stop loader
      
    }
  );
  
  }


}

import { Component } from '@angular/core';
import { RouterLink,Router,ActivatedRoute } from '@angular/router';
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
  selector: 'app-candidates-create-accounts',
 imports: [RouterLink, NavbarComponent,AngularPhoneNumberInput,ReactiveFormsModule,CommonModule,FormsModule],
  templateUrl: './candidates-create-accounts.component.html',
  styleUrl: './candidates-create-accounts.component.css'
})
export class CandidatesCreateAccountsComponent {
  ServiceForm : FormGroup;
  isLoading: boolean = false;

  constructor(private fb: FormBuilder, private toastr: ToastrService,private http: HttpClient,private location: Location,private router: Router,) {
    this.ServiceForm = this.fb.group({
      civility : ['',Validators.required],
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone_number : ['', Validators.required],
      password : ['',Validators.required,Validators.maxLength(10)]
     
    });
  }

  SaveCandidates(): void{
    if (this.ServiceForm.invalid || this.isLoading) return;
      this.isLoading = true; // Active le loading
      const FormData = this.ServiceForm.value;
      this.http.post<any>(`${CONFIG.apiUrl}/candidate/create`, FormData).subscribe(
    (response) => {
      this.toastr.success(response.message || 'Votre compte a été crée avec succès');
      this.isLoading = false; // Stop loader
      this.router.navigate(['/home']);
      
    },
    (error) => {
      const message = error?.error?.detail || "Erreur lors de l'enregistrement";
      this.toastr.error(message);
      this.isLoading = false; // Stop loader
      
    }
  );
  
  }

}

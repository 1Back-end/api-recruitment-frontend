import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { HttpClient ,HttpParams} from '@angular/common/http';  // Import HttpClient
import { CONFIG } from '../../../../config';
import { FormsModule } from '@angular/forms'; 
import { RouterLink } from '@angular/router';
import { Router } from '@angular/router';
@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,RouterLink],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css'
})
export class ForgotPasswordComponent {

  LoginForm: FormGroup;
  showPassword: boolean = false;
  isLoading: boolean = false;

  constructor(
    private toastr: ToastrService, private fb: FormBuilder, private http: HttpClient, private router: Router,
  ) {
    this.LoginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }
  onSubmit() {
  if (this.LoginForm.invalid) return;

  const email = this.LoginForm.value.email;

  this.isLoading = true; // Activation uniquement après les vérifications

  this.http.post(`${CONFIG.apiUrl}/authentification/start-reset-password/administrator`, { email }).subscribe(
    (res: any) => {
      this.toastr.success(res.message || 'Un code a été envoyé à votre adresse email');
      localStorage.setItem('reset_email', email);
      this.router.navigate(['/auth/code-otp']);
      this.isLoading = false;
    },
    (err) => {
      const msg = err?.error?.detail || "Une erreur est survenue. Vérifiez l'adresse email";
      this.toastr.error(msg);
      this.isLoading = false;
    }
  );
}

  

}

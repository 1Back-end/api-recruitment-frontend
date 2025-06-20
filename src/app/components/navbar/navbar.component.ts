import { Component } from '@angular/core';
import {RoleService } from '../../services/role.service';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms'; 
import { AuthService } from '../../services/auth.service';
import { ElementRef, ViewChild, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient} from '@angular/common/http';
@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink,CommonModule, RouterLink, ReactiveFormsModule, FormsModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  isAuthenticated = false;
  
  constructor(public role: RoleService,
    public authService: AuthService, // public au lieu de private
    @Inject(PLATFORM_ID) private platformId: Object,
    private http: HttpClient,
  ) {}
  logout() {
    this.authService.logout();
  }

   ngOnInit(): void {
    // Vérifie si l'utilisateur est authentifié
    this.isAuthenticated = !!this.authService.getToken();
  }

  

}

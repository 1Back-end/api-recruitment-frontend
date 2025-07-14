
import {RoleService } from '../services/role.service';
import { Component, OnInit, ViewChild  } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { HttpClient, HttpParams } from '@angular/common/http';
import { CONFIG } from '../../../config';
// import { NgxChartsModule } from '@swimlane/ngx-charts';


@Component({
  selector: 'app-dashboard',
   imports: [CommonModule, ReactiveFormsModule,FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  totalUsers: number = 0;
   totalOrganisations : number = 0;
   totalServices : number = 0;
   totalCandidats : number = 0;
   totalOwners : number = 0;
   chartData: { name: string; value: number }[] = [];

  
  constructor(private toastr: ToastrService, private fb: FormBuilder, private http: HttpClient,public role: RoleService) {
    
  }

  ngOnInit(): void {
    this.loadUserCount();
    // this.loadServicesCount();
    this.loadOrganisationsCount();
    this.loadCandidatesCount();
    
  }

  loadUserCount(): void {
    this.http.get<any>(`${CONFIG.apiUrl}/statistics/count-users`)
      .subscribe({
        next: (res) => {
          this.totalUsers = res.total_users;
        },
        error: (error:any) => {
          const message = error?.error?.detail;
          this.toastr.error(message);
        }
      });
  }

  loadCandidatesCount(): void {
    this.http.get<any>(`${CONFIG.apiUrl}/statistics/total-candidates`)
      .subscribe({
        next: (res) => {
          this.totalCandidats = res.total_candidates;
        },
        error: (error:any) => {
          const message = error?.error?.detail;
          this.toastr.error(message);
        }
      });
  }

  loadOwnersCount(): void {
    this.http.get<any>(`${CONFIG.apiUrl}/statistics/total-owners`)
      .subscribe({
        next: (res) => {
          this.totalOwners = res.total_owners;
        },
        error: (error:any) => {
          const message = error?.error?.detail;
          this.toastr.error(message);
        }
      });
  }

  loadOrganisationsCount(): void{
    this.http.get<any>(`${CONFIG.apiUrl}/statistics/total-companies`)
      .subscribe({
        next: (res) => {
          this.totalOrganisations = res.total_companies;
        },
        error: (error:any) => {
          const message = error?.error?.detail;
          this.toastr.error(message);
        }
      });
  }
}

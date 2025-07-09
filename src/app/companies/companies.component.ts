import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { HttpClient ,HttpParams} from '@angular/common/http';  // Import HttpClient
import { CONFIG } from '../../../config';
import { FormsModule } from '@angular/forms'; 
import {NavbarComponent} from '../components/navbar/navbar.component';
import {FooterComponent} from '../components/footer/footer.component';
import {NewslettersComponent} from '../components/newsletters/newsletters.component';
@Component({
  selector: 'app-companies',
   imports: [CommonModule, RouterLink, ReactiveFormsModule, FormsModule, NavbarComponent,FooterComponent,NewslettersComponent],
  templateUrl: './companies.component.html',
  styleUrl: './companies.component.css'
})
export class CompaniesComponent {
  
  company: any[] = [];
  isLoading: boolean = false;
  currentPage: number = 1;
  totalPages: number = 0;
  titlesPerPage: number = 25;
  searchQuery: string = '';
  exportUrl: string = '';
  totalItems: number = 0;
  direction: { [key: string]: 'asc' | 'desc' } = {}; // pour le tri par colonne

  constructor(private http: HttpClient, private toastr: ToastrService) {}

  ngOnInit(): void {
  this.get_activate_company(); // Charger les utilisateurs au démarrage
}


 get_activate_company(keyword?: string): void {
  this.isLoading = true;

  let params = new HttpParams()
      .set('page', this.currentPage.toString())
      .set('per_page', this.titlesPerPage.toString());

      if (keyword && keyword.trim() !== '') {
        params = params.set('keyword', keyword.trim());
      }

  this.http.get<any>(`${CONFIG.apiUrl}/company/activate_company`, { params }).subscribe(
    (response) => {
      this.company = this.currentPage === 1 ? response.data : [...this.company, ...response.data];
      this.currentPage = response.current_page;
      this.totalPages = response.pages; // ✅ Correspond à "pages" dans ta réponse
      this.totalItems = response.total;
      this.isLoading = false;
      // console.log(response.data)
    },
    (error) => {
      // this.toastr.error('Erreur lors du chargement des entreprises');
      this.isLoading = false;
    }
  );
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.get_activate_company();
  }
   onSearchChange(): void {
    this.currentPage = 1;
    this.get_activate_company(this.searchQuery);
  }
  

  loadMore(): void {
    if (this.currentPage < this.totalPages) {
    this.currentPage++;
    this.get_activate_company();
  }


}

}

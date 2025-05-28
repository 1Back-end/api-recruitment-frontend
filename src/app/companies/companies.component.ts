import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import {NavbarComponent } from '../components/navbar/navbar.component';
@Component({
  selector: 'app-companies',
  imports: [RouterLink, NavbarComponent],
  templateUrl: './companies.component.html',
  styleUrl: './companies.component.css'
})
export class CompaniesComponent {

}

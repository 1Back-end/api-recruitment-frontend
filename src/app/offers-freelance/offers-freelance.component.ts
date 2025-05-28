import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import {NavbarComponent } from '../components/navbar/navbar.component';
@Component({
  selector: 'app-offers-freelance',
  imports: [RouterLink,NavbarComponent],
  templateUrl: './offers-freelance.component.html',
  styleUrl: './offers-freelance.component.css'
})
export class OffersFreelanceComponent {

}

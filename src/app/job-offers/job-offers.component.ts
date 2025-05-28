import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import {NavbarComponent } from '../components/navbar/navbar.component';
@Component({
  selector: 'app-job-offers',
  imports: [RouterLink, NavbarComponent],
  templateUrl: './job-offers.component.html',
  styleUrl: './job-offers.component.css'
})
export class JobOffersComponent {

}

import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import {NavbarComponent } from '../components/navbar/navbar.component';
@Component({
  selector: 'app-candidates',
  imports: [RouterLink, NavbarComponent],
  templateUrl: './candidates.component.html',
  styleUrl: './candidates.component.css'
})
export class CandidatesComponent {

}

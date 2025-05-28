import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import {NavbarComponent } from '../../components/navbar/navbar.component';
@Component({
  selector: 'app-candidates-create-accounts',
  imports: [RouterLink, NavbarComponent],
  templateUrl: './candidates-create-accounts.component.html',
  styleUrl: './candidates-create-accounts.component.css'
})
export class CandidatesCreateAccountsComponent {

}

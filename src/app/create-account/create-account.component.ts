import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import {NavbarComponent } from '../components/navbar/navbar.component';
@Component({
  selector: 'app-create-account',
  imports: [RouterLink, NavbarComponent],
  templateUrl: './create-account.component.html',
  styleUrl: './create-account.component.css'
})
export class CreateAccountComponent {

}

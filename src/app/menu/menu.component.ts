import { Component, EventEmitter, Output } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { NgClass, NgForOf, NgIf } from '@angular/common';
import { RoleService } from '../services/role.service';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [
    RouterLinkActive,
    RouterLink,
    NgForOf,
    NgIf,
    NgClass,
  ],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent {
  @Output() closeOffCanvas = new EventEmitter<boolean>();

  constructor(private router: Router, public role: RoleService) {}

  menuRoutes: any = [
    {
      id: 'dashboard',
      path: '/admin/dashboard',
      label: 'Tableau de bord',
      icon: 'fa-solid fa-chart-simple', // Icône de tableau de bord
      visibleFor: ['SUPER_ADMIN'],
      children: [],
      subMenuRoutes: [],
    },
    {
      id: 'company',
      path: '/admin/main/company',
      label: 'Gestion des entreprises',
      icon: 'fa-solid fa-house-laptop', // Icône pour réception
      visibleFor: ['ADMIN','SUPER_ADMIN'],
      children: [],
      subMenuRoutes: [],
    },
  
    {
      id: 'utilisateurs',
      path: '/admin/users',
      label: 'Gestion des utilisateurs',
      icon: 'fa-solid fa-users-gear', // Icône pour réception
      visibleFor: ['ADMIN','SUPER_ADMIN'],
      children: [],
      subMenuRoutes: [],
    },

    {
      id: 'settings ',
      path: '/admin/settings ',
      label: 'Paramètres',
      icon: 'fa-solid fa-gear', // Icône pour réception
      visibleFor: ['ADMIN','SUPER_ADMIN'],
      children: [],
      subMenuRoutes: [],
    },
   
    
  ];
 
  closeCanvas() {
    this.closeOffCanvas.emit(true);
  }

  isActiveSubmenu(routes: string[]): boolean {
    return routes.some(route => this.router.url.startsWith(route));
  }

  hasPermission(route: any): boolean {
    return !route.visibleFor || route.visibleFor.includes(this.role.getUserRole());
  }
}

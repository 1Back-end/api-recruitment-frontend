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
      icon: 'fa-solid fa-building-user', // Icône pour réception
      visibleFor: ['ADMIN','SUPER_ADMIN'],
      children: [],
      subMenuRoutes: [],
    },
    {
      id: 'owners',
      path: '/admin/main/owners',
      label: 'Gestion des chefs d’entreprise',
      icon: 'fa-solid fa-user-secret', // Icône pour réception
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


    {
      id : 'diplomas',
      path : '/users/users/diplomas',
      label: 'Mes diplômes',
      icon: 'fa-solid fa-graduation-cap', // Icône pour réception
      visibleFor: ["CANDIDATE"],
      children: [],
      subMenuRoutes: [],
    },
    {
      id : 'experiences',
      path : '/users/users/experiences',
      label: 'Mes expériences',
      icon: 'fa-solid fa-briefcase', // Icône pour réception
      visibleFor: ["CANDIDATE"],
      children: [],
      subMenuRoutes: [],
    },
    {
      id : 'competences',
      path : '/users/users/competences',
      label: 'Mes compétences',
      icon: 'fa-solid fa-award', // Icône pour réception
      visibleFor: ["CANDIDATE"],
      children: [],
      subMenuRoutes: [],
    },
    {
      id : 'languages',
      path : '/users/users/languages',
      label: 'Mes langues',
      icon: 'fa-solid fa-language', // Icône pour réception
      visibleFor: ["CANDIDATE"],
      children: [],
      subMenuRoutes: [],
    },
    {
      id : 'hobbies',
      path : '/users/users/hobbies',
      label: 'Centres d\'interêts',
      icon: 'fa-solid fa-heart', // Icône pour réception
      visibleFor: ["CANDIDATE"],
      children: [],
      subMenuRoutes: [],
    },
    {
      id : 'others',
      path : '/users/users/others',
      label: 'Autres informations',
      icon: 'fa-solid fa-circle-info', // Icône pour réception
      visibleFor: ["CANDIDATE"],
      children: [],
      subMenuRoutes: [],
    },
    {
      id : 'job_offers',
      path : '/users/my_offers',
      label: 'Mes offres d\'emploi',
      icon: 'fa-solid fa-envelope-open-text', // Icône pour réception
      visibleFor: ["CANDIDATE"],
      children: [],
      subMenuRoutes: [],
    },
    // {
    //   id : 'accounts',
    //   path : '/users/my_accounts',
    //   label: 'Gestion de mon compte',
    //   icon: 'fa-solid fa-user-secret', // Icône pour réception
    //   visibleFor: ["CANDIDATE"],
    //   children: [],
    //   subMenuRoutes: [],
    // },
   
    {
      id: 'home',
      path: '/home', // Redirige vers la page d'accueil
      label: 'Retour à l’accueil',
      icon: 'fa-solid fa-arrow-left', // Icône de retour
      visibleFor: ["CANDIDATE"],
      children: [],
      subMenuRoutes: [],
    }

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

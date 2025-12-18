import { Component, inject } from '@angular/core';
import { RippleModule } from 'primeng/ripple';
import { ButtonModule } from 'primeng/button';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [RippleModule, ButtonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {

  router = inject(Router);

  navigateTo(route: string): void {
    this.router.navigate([`/${route}`]);
  }
}

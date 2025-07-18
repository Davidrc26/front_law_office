import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-select-role',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './select-role.component.html',
  styleUrl: './select-role.component.scss'
})
export default class SelectRoleComponent implements OnInit {
  roles: string[] = [];
  selectedRole: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.authService.getAvailableRoles().subscribe(roles => {
      this.roles = roles;
    });
  }

  selectRole() {
    if (!this.selectedRole) return;
    this.authService.assignRoleToUser(this.selectedRole).subscribe(() => {
      // Redirigir según el rol seleccionado
      if (this.selectedRole === 'TEACHER') {
        this.router.navigate(['/perfil-teacher']);
      } else if (this.selectedRole === 'ASSISTANT') {
        this.router.navigate(['/perfil-assistant']);
      } else if (this.selectedRole === 'STUDENT') {
        this.router.navigate(['/perfil-student']);
      } else {
        this.router.navigate(['/']);
      }
    });
  }
} 
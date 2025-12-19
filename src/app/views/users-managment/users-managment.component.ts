import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalComponent } from '../../layout/modal/modal.component';
import { UserFormComponent } from '../../forms/user-form/user-form.component';
import { CreateStudentDTO, User } from '../../models/user';
import { UserRegisterService } from '../../services/user-register.service';
import { AlertService } from '../../services/alerts.service';

@Component({
  selector: 'app-users-managment',
  imports: [CommonModule, ModalComponent, UserFormComponent],
  templateUrl: './users-managment.component.html',
  styleUrl: './users-managment.component.scss'
})
export default class UsersManagmentComponent implements OnInit {
  users: User[] = [];
  filteredUsers: User[] = [];
  isModalOpen = false;
  selectedUser?: User;
  isEditMode = false;
  loading = false;
  searchTerm = '';

  // Paginación
  currentPage = 1;
  itemsPerPage = 10;
  totalPages = 1;

  constructor(
    private userService: UserRegisterService,
    private alertService: AlertService
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  /**
   * Carga todos los usuarios desde el backend
   */
  loadUsers(): void {
    this.loading = true;
    this.userService.getAllUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.filteredUsers = users;
        this.updatePagination();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar usuarios:', error);
        this.alertService.error(
          'Error al cargar usuarios',
          'No se pudieron cargar los usuarios. Intente nuevamente.'
        );
        this.loading = false;
      }
    });
  }

  /**
   * Abre el modal para crear un nuevo usuario
   */
  openCreateModal(): void {
    this.isEditMode = false;
    this.selectedUser = undefined;
    this.isModalOpen = true;
  }

  /**
   * Abre el modal para editar un usuario existente
   */
  openEditModal(user: User): void {
    this.selectedUser = user;
    this.isEditMode = true;
    this.isModalOpen = true;
  }

  /**
   * Maneja el envío del formulario (crear o actualizar)
   */
  handleUserSubmit(userData: any): void {
    if (this.isEditMode) {
      this.updateUser(userData);
    } else {
      this.createUser(userData);
    }
  }

  /**
   * Crea un nuevo usuario
   */
  private createUser(userData: User): void {
    this.alertService.loading('Creando usuario...');
    
    this.userService.registerUser(userData as any).subscribe({
      next: (response) => {
        this.alertService.success(
          '¡Usuario creado!',
          'El usuario ha sido creado exitosamente.'
        );
        this.closeModal();
        this.loadUsers();
      },
      error: (error) => {
        console.error('Error al crear usuario:', error);
        const errorMessage = error.error?.message || 'No se pudo crear el usuario.';
        this.alertService.error('Error al crear usuario', errorMessage);
      }
    });
  }

  /**
   * Actualiza un usuario existente
   */
  private updateUser(userData: User): void {
    if (!userData.id) return;

    this.alertService.loading('Actualizando usuario...');
    
    // Aquí deberías tener un método update en tu servicio
    // Por ahora simulo la actualización
    setTimeout(() => {
      this.alertService.success(
        '¡Usuario actualizado!',
        'Los datos del usuario han sido actualizados exitosamente.'
      );
      this.closeModal();
      this.loadUsers();
    }, 1000);

    // Cuando tengas el endpoint:
    // this.userService.updateUser(userData.id, userData).subscribe({
    //   next: (response) => {
    //     this.alertService.success('Usuario actualizado', 'Los datos han sido actualizados.');
    //     this.closeModal();
    //     this.loadUsers();
    //   },
    //   error: (error) => {
    //     console.error('Error al actualizar usuario:', error);
    //     this.alertService.error('Error', 'No se pudo actualizar el usuario.');
    //   }
    // });
  }

  /**
   * Elimina un usuario
   */
  deleteUser(user: User): void {
    const fullName = `${user.firstName} ${user.secondName || ''} ${user.lastName} ${user.secondLastName || ''}`.trim();
    this.alertService.confirm(
      '¿Eliminar usuario?',
      `¿Estás seguro de que deseas eliminar a ${fullName}? Esta acción no se puede deshacer.`
    ).then((result) => {
      if (result.isConfirmed) {
        this.confirmDelete(user.id!);
      }
    });
  }

  /**
   * Confirma y ejecuta la eliminación
   */
  private confirmDelete(userId: number): void {
    this.alertService.loading('Eliminando usuario...');
    
    // Simular eliminación (reemplaza con tu servicio real)
    setTimeout(() => {
      this.users = this.users.filter(u => u.id !== userId);
      this.applyFilters();
      this.alertService.success(
        '¡Usuario eliminado!',
        'El usuario ha sido eliminado exitosamente.'
      );
    }, 1000);

    // Cuando tengas el endpoint:
    // this.userService.deleteUser(userId).subscribe({
    //   next: () => {
    //     this.alertService.success('Usuario eliminado', 'El usuario ha sido eliminado.');
    //     this.loadUsers();
    //   },
    //   error: (error) => {
    //     console.error('Error al eliminar usuario:', error);
    //     this.alertService.error('Error', 'No se pudo eliminar el usuario.');
    //   }
    // });
  }

  /**
   * Cierra el modal
   */
  closeModal(): void {
    this.isModalOpen = false;
    this.selectedUser = undefined;
    this.isEditMode = false;
  }

  /**
   * Filtra usuarios por término de búsqueda
   */
  onSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchTerm = input.value.toLowerCase();
    this.applyFilters();
  }

  /**
   * Aplica filtros a la lista de usuarios
   */
  private applyFilters(): void {
    if (!this.searchTerm) {
      this.filteredUsers = [...this.users];
    } else {
      this.filteredUsers = this.users.filter(user => 
        user.firstName.toLowerCase().includes(this.searchTerm) ||
        user.secondName?.toLowerCase().includes(this.searchTerm) ||
        user.lastName.toLowerCase().includes(this.searchTerm) ||
        user.secondLastName?.toLowerCase().includes(this.searchTerm) ||
        user.email.toLowerCase().includes(this.searchTerm) ||
        user.documentNumber.toLowerCase().includes(this.searchTerm)
      );
    }
    this.currentPage = 1;
    this.updatePagination();
  }

  /**
   * Actualiza la información de paginación
   */
  private updatePagination(): void {
    this.totalPages = Math.ceil(this.filteredUsers.length / this.itemsPerPage);
  }

  /**
   * Obtiene los usuarios de la página actual
   */
  get paginatedUsers(): User[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredUsers.slice(startIndex, endIndex);
  }

  /**
   * Cambia de página
   */
  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  /**
   * Obtiene el nombre del rol en español
   */
  getRoleName(user: User): string {
    if (user.roles && user.roles.length > 0) {
      return user.roles[0].spanishName || user.roles[0].name;
    }
    return 'N/A';
  }

  /**
   * Obtiene la clase CSS del badge según el rol
   */
  getRoleBadgeClass(user: User): string {
    if (user.roles && user.roles.length > 0) {
      const roleName = user.roles[0].name.toUpperCase();
      switch(roleName) {
        case 'STUDENT':
          return 'badge-student';
        case 'TEACHER':
        case 'PROFESSOR':
          return 'badge-teacher';
        case 'ASSISTANT':
          return 'badge-assistant';
        default:
          return 'badge-default';
      }
    }
    return 'badge-default';
  }

  /**
   * Genera el array de números de página para mostrar
   */
  get pageNumbers(): number[] {
    const pages: number[] = [];
    const maxPagesToShow = 5;
    let startPage = Math.max(1, this.currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(this.totalPages, startPage + maxPagesToShow - 1);

    if (endPage - startPage < maxPagesToShow - 1) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  }
}

# Formulario de Usuario - Guía de Uso

## Características

✅ **Formularios Reactivos** con validaciones en tiempo real
✅ **Campos dinámicos** según el rol seleccionado
✅ **Validaciones personalizadas** (emails, teléfonos, contraseñas)
✅ **Modo creación y edición**
✅ **Integración con backend** para roles y áreas
✅ **Diseño responsive** y accesible
✅ **Mensajes de error claros** y específicos

## Estructura de Roles

### 1. **Estudiante (STUDENT)**
Campos adicionales requeridos:
- **Código de Estudiante**: Identificador único
- **Semestre**: Valor entre 1 y 12

### 2. **Docente (TEACHER)**
Campos adicionales requeridos:
- **Área**: Selección de área de trabajo
- **Especialidad**: Campo de texto
- **Años de Experiencia**: Número mayor o igual a 0

### 3. **Asistente (ASSISTANT)**
Campos adicionales requeridos:
- **Área**: Selección de área de trabajo
- **Posición/Cargo**: Descripción del cargo

## Uso del Componente

### 1. Importación

```typescript
import { UserFormComponent } from './forms/user-form/user-form.component';

@Component({
  selector: 'app-users-management',
  imports: [UserFormComponent],
  // ...
})
```

### 2. Implementación Básica (Crear Usuario)

```typescript
// Component TypeScript
export class UsersManagementComponent {
  showUserForm = false;

  handleUserSubmit(userData: User) {
    console.log('Usuario a crear:', userData);
    // Aquí llamarías a tu servicio para crear el usuario
    this.userService.create(userData).subscribe({
      next: (response) => {
        console.log('Usuario creado:', response);
        this.showUserForm = false;
      },
      error: (error) => {
        console.error('Error al crear usuario:', error);
      }
    });
  }

  handleCancel() {
    this.showUserForm = false;
  }
}
```

```html
<!-- Component HTML -->
<app-user-form
  *ngIf="showUserForm"
  (onSubmit)="handleUserSubmit($event)"
  (onCancel)="handleCancel()">
</app-user-form>
```

### 3. Implementación en Modo Edición

```typescript
// Component TypeScript
export class UsersManagementComponent {
  selectedUser?: User;
  showEditForm = false;

  editUser(user: User) {
    this.selectedUser = user;
    this.showEditForm = true;
  }

  handleUserUpdate(userData: User) {
    console.log('Usuario a actualizar:', userData);
    this.userService.update(userData.id!, userData).subscribe({
      next: (response) => {
        console.log('Usuario actualizado:', response);
        this.showEditForm = false;
        this.selectedUser = undefined;
      },
      error: (error) => {
        console.error('Error al actualizar:', error);
      }
    });
  }

  handleCancel() {
    this.showEditForm = false;
    this.selectedUser = undefined;
  }
}
```

```html
<!-- Component HTML -->
<app-user-form
  *ngIf="showEditForm"
  [user]="selectedUser"
  [isEditMode]="true"
  (onSubmit)="handleUserUpdate($event)"
  (onCancel)="handleCancel()">
</app-user-form>
```

### 4. Uso con Modal

```typescript
// Component TypeScript
export class UsersManagementComponent {
  isModalOpen = false;
  selectedUser?: User;
  isEditMode = false;

  openCreateModal() {
    this.isEditMode = false;
    this.selectedUser = undefined;
    this.isModalOpen = true;
  }

  openEditModal(user: User) {
    this.isEditMode = true;
    this.selectedUser = user;
    this.isModalOpen = true;
  }

  handleUserSubmit(userData: User) {
    if (this.isEditMode) {
      // Actualizar usuario
      this.userService.update(userData.id!, userData).subscribe({
        next: () => {
          this.closeModal();
          this.loadUsers(); // Recargar lista
        }
      });
    } else {
      // Crear usuario
      this.userService.create(userData).subscribe({
        next: () => {
          this.closeModal();
          this.loadUsers(); // Recargar lista
        }
      });
    }
  }

  closeModal() {
    this.isModalOpen = false;
    this.selectedUser = undefined;
    this.isEditMode = false;
  }
}
```

```html
<!-- Component HTML -->
<button (click)="openCreateModal()">Nuevo Usuario</button>

<app-modal
  [isOpen]="isModalOpen"
  [title]="isEditMode ? 'Editar Usuario' : 'Nuevo Usuario'"
  size="large"
  [showFooter]="false"
  (onClose)="closeModal()">
  
  <app-user-form
    [user]="selectedUser"
    [isEditMode]="isEditMode"
    (onSubmit)="handleUserSubmit($event)"
    (onCancel)="closeModal()">
  </app-user-form>
  
</app-modal>
```

## Props del Componente

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `user` | User \| undefined | undefined | Usuario a editar (modo edición) |
| `isEditMode` | boolean | false | Activa el modo edición |

## Eventos

| Evento | Parámetro | Descripción |
|--------|-----------|-------------|
| `onSubmit` | User | Se emite cuando se envía el formulario |
| `onCancel` | void | Se emite cuando se cancela la operación |

## Validaciones Implementadas

### Campos Comunes
- **Username**: Requerido, 4-50 caracteres
- **Nombre**: Requerido, 2-100 caracteres
- **Apellido**: Requerido, 2-100 caracteres
- **Email**: Requerido, formato email válido
- **Teléfono**: Requerido, 9-15 dígitos
- **Contraseña**: Requerido (creación), mínimo 8 caracteres
- **Confirmar Contraseña**: Debe coincidir con contraseña
- **Rol**: Requerido

### Campos de Estudiante
- **Código de Estudiante**: Requerido
- **Semestre**: Requerido, 1-12

### Campos de Docente
- **Área**: Requerido
- **Especialidad**: Requerido, mínimo 3 caracteres
- **Años de Experiencia**: Requerido, mayor o igual a 0

### Campos de Asistente
- **Área**: Requerido
- **Posición**: Requerido

## Estructura de Datos

```typescript
// Datos enviados al backend
{
  username: "juan.perez",
  name: "Juan",
  lastName: "Pérez",
  email: "juan@example.com",
  phone: "987654321",
  password: "password123", // Solo en creación
  roleId: 1,
  
  // Si es estudiante:
  studentId: "20210001",
  semester: 8,
  
  // Si es docente:
  areaId: 2,
  specialty: "Derecho Civil",
  yearsOfExperience: 5,
  
  // Si es asistente:
  areaId: 1,
  position: "Asistente Administrativo"
}
```

## Configuración del Backend

El formulario espera los siguientes endpoints:

### Roles
```
GET http://localhost:8081/api/roles/all
```
Respuesta esperada:
```json
[
  { "id": 1, "name": "STUDENT", "spanishName": "Estudiante" },
  { "id": 2, "name": "TEACHER", "spanishName": "Docente" },
  { "id": 3, "name": "ASSISTANT", "spanishName": "Asistente" }
]
```

### Áreas
```
GET http://localhost:8081/api/areas/all
```
Respuesta esperada:
```json
[
  { "id": 1, "name": "Derecho Civil" },
  { "id": 2, "name": "Derecho Penal" },
  { "id": 3, "name": "Derecho Laboral" }
]
```

## Personalización

### Ajustar nombres de roles
Si tus roles tienen nombres diferentes en el backend, modifica las constantes en el componente:

```typescript
readonly ROLE_STUDENT = 'STUDENT';     // Cambiar al nombre en tu backend
readonly ROLE_TEACHER = 'TEACHER';     // Cambiar al nombre en tu backend
readonly ROLE_ASSISTANT = 'ASSISTANT'; // Cambiar al nombre en tu backend
```

### Agregar más campos
Para agregar campos adicionales:

1. Agregar al modelo User en `models/user.ts`
2. Agregar al FormGroup en `initForm()`
3. Agregar las validaciones en `updateFieldValidators()`
4. Agregar el campo en el HTML
5. Incluir en el objeto userData en `handleSubmit()`

## Ejemplo Completo

```typescript
// users-management.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserFormComponent } from '../../forms/user-form/user-form.component';
import { ModalComponent } from '../../layout/modal/modal.component';
import { User } from '../../models/user';
import { UserRegisterService } from '../../services/user-register.service';

@Component({
  selector: 'app-users-management',
  imports: [CommonModule, UserFormComponent, ModalComponent],
  templateUrl: './users-management.component.html'
})
export class UsersManagementComponent implements OnInit {
  users: User[] = [];
  isModalOpen = false;
  selectedUser?: User;
  isEditMode = false;
  loading = false;

  constructor(private userService: UserRegisterService) {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.loading = true;
    this.userService.getAllUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar usuarios:', error);
        this.loading = false;
      }
    });
  }

  openCreateModal() {
    this.isEditMode = false;
    this.selectedUser = undefined;
    this.isModalOpen = true;
  }

  openEditModal(user: User) {
    this.isEditMode = true;
    this.selectedUser = user;
    this.isModalOpen = true;
  }

  handleUserSubmit(userData: User) {
    if (this.isEditMode) {
      this.updateUser(userData);
    } else {
      this.createUser(userData);
    }
  }

  createUser(userData: User) {
    this.userService.registerUser(userData as any).subscribe({
      next: (response) => {
        console.log('Usuario creado:', response);
        this.closeModal();
        this.loadUsers();
      },
      error: (error) => {
        console.error('Error al crear usuario:', error);
      }
    });
  }

  updateUser(userData: User) {
    // Implementar lógica de actualización
    console.log('Actualizar usuario:', userData);
    this.closeModal();
    this.loadUsers();
  }

  closeModal() {
    this.isModalOpen = false;
    this.selectedUser = undefined;
    this.isEditMode = false;
  }
}
```

```html
<!-- users-management.component.html -->
<div class="users-container">
  <div class="header">
    <h1>Gestión de Usuarios</h1>
    <button class="btn btn-primary" (click)="openCreateModal()">
      <i class="pi pi-plus"></i> Nuevo Usuario
    </button>
  </div>

  <div class="users-list">
    <!-- Lista de usuarios aquí -->
  </div>

  <!-- Modal con Formulario -->
  <app-modal
    [isOpen]="isModalOpen"
    [title]="isEditMode ? 'Editar Usuario' : 'Nuevo Usuario'"
    size="large"
    [showFooter]="false"
    (onClose)="closeModal()">
    
    <app-user-form
      [user]="selectedUser"
      [isEditMode]="isEditMode"
      (onSubmit)="handleUserSubmit($event)"
      (onCancel)="closeModal()">
    </app-user-form>
    
  </app-modal>
</div>
```

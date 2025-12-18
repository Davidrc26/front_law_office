import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { User } from '../../models/user';
import { Role } from '../../models/role';
import { Area } from '../../models/area';
import { RoleService } from '../../services/role.service';
import { AreaServiceService } from '../../services/area.service';
import { UserRegisterService } from '../../services/user-register.service';

@Component({
  selector: 'app-user-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.scss'
})
export class UserFormComponent implements OnInit {
  @Input() user?: User;
  @Input() isEditMode: boolean = false;
  @Output() onSubmit = new EventEmitter<User>();
  @Output() onCancel = new EventEmitter<void>();

  userForm!: FormGroup;
  roles: Role[] = [];
  areas: Area[] = [];
  loading: boolean = false;
  submitted: boolean = false;

  // Tipos de rol según nombre (ajusta según tu backend)
  readonly ROLE_STUDENT = 'STUDENT';
  readonly ROLE_TEACHER = 'TEACHER';
  readonly ROLE_ASSISTANT = 'ASSISTANT';

  constructor(
    private fb: FormBuilder,
    private roleService: RoleService,
    private areaService: AreaServiceService,
    private userRegisterService: UserRegisterService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadRoles();
    this.loadAreas();
    this.setupRoleChangeListener();

    if (this.user && this.isEditMode) {
      this.patchFormValues();
    }
  }

  /**
   * Inicializa el formulario reactivo con todos los campos posibles
   */
  private initForm(): void {
    this.userForm = this.fb.group({
      // Campos comunes para todos los usuarios
      username: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(50)]],
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      lastName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]{9,15}$/)]],
      password: ['', this.isEditMode ? [] : [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', this.isEditMode ? [] : [Validators.required]],
      roleId: ['', Validators.required],
      
      // Campo condicional (docentes y asistentes)
      areaId: [''],
      
      // Campos específicos de estudiante
      studentId: [''],
      semester: [''],
      
      // Campos específicos de docente
      specialty: [''],
      yearsOfExperience: [''],
      
      // Campos específicos de asistente
      position: ['']
    }, { validators: this.passwordMatchValidator });
  }

  /**
   * Validador personalizado para verificar que las contraseñas coincidan
   */
  private passwordMatchValidator(group: FormGroup): { [key: string]: boolean } | null {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    
    if (!password || !confirmPassword) {
      return null;
    }
    
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  /**
   * Configura el listener para cambios en el rol seleccionado
   */
  private setupRoleChangeListener(): void {
    this.userForm.get('roleId')?.valueChanges.subscribe((roleId) => {
      this.updateFieldValidators(roleId);
    });
  }

  /**
   * Actualiza los validadores de los campos según el rol seleccionado
   */
  private updateFieldValidators(roleId: number): void {
    const selectedRole = this.roles.find(r => r.id === Number(roleId));
    if (!selectedRole) return;

    const roleName = selectedRole.name.toUpperCase();

    // Limpiar todos los validadores específicos
    this.clearConditionalValidators();

    // Aplicar validadores según el rol
    if (roleName === this.ROLE_STUDENT) {
      this.userForm.get('studentId')?.setValidators([Validators.required]);
      this.userForm.get('semester')?.setValidators([Validators.required, Validators.min(1), Validators.max(12)]);
    } else if (roleName === this.ROLE_TEACHER) {
      this.userForm.get('areaId')?.setValidators([Validators.required]);
      this.userForm.get('specialty')?.setValidators([Validators.required, Validators.minLength(3)]);
      this.userForm.get('yearsOfExperience')?.setValidators([Validators.required, Validators.min(0)]);
    } else if (roleName === this.ROLE_ASSISTANT) {
      this.userForm.get('areaId')?.setValidators([Validators.required]);
      this.userForm.get('position')?.setValidators([Validators.required]);
    }

    // Actualizar la validez de los campos
    this.updateFieldsValidity();
  }

  /**
   * Limpia los validadores condicionales
   */
  private clearConditionalValidators(): void {
    this.userForm.get('areaId')?.clearValidators();
    this.userForm.get('studentId')?.clearValidators();
    this.userForm.get('semester')?.clearValidators();
    this.userForm.get('specialty')?.clearValidators();
    this.userForm.get('yearsOfExperience')?.clearValidators();
    this.userForm.get('position')?.clearValidators();
  }

  /**
   * Actualiza la validez de todos los campos condicionales
   */
  private updateFieldsValidity(): void {
    this.userForm.get('areaId')?.updateValueAndValidity();
    this.userForm.get('studentId')?.updateValueAndValidity();
    this.userForm.get('semester')?.updateValueAndValidity();
    this.userForm.get('specialty')?.updateValueAndValidity();
    this.userForm.get('yearsOfExperience')?.updateValueAndValidity();
    this.userForm.get('position')?.updateValueAndValidity();
  }

  /**
   * Carga la lista de roles desde el backend
   */
  private loadRoles(): void {
    this.roleService.getAllRoles().subscribe({
      next: (roles) => {
        this.roles = roles;
      },
      error: (error) => {
        console.error('Error al cargar roles:', error);
      }
    });
  }

  /**
   * Carga la lista de áreas desde el backend
   */
  private loadAreas(): void {
    this.areaService.getAllAreas().subscribe({
      next: (response) => {
        this.areas = response;
      },
      error: (error) => {
        console.error('Error al cargar áreas:', error);
      }
    });
  }

  /**
   * Rellena el formulario con los datos del usuario en modo edición
   */
  private patchFormValues(): void {
    if (!this.user) return;

    this.userForm.patchValue({
      username: this.user.username,
      name: this.user.name,
      lastName: this.user.lastName,
      email: this.user.email,
      phone: this.user.phone,
      roleId: this.user.roleId,
      areaId: this.user.areaId,
      studentId: this.user.studentId,
      semester: this.user.semester,
      specialty: this.user.specialty,
      yearsOfExperience: this.user.yearsOfExperience,
      position: this.user.position
    });
  }

  /**
   * Determina si se deben mostrar campos específicos según el rol
   */
  get isStudent(): boolean {
    const roleId = this.userForm.get('roleId')?.value;
    const role = this.roles.find(r => r.id === Number(roleId));
    return role?.name.toUpperCase() === this.ROLE_STUDENT;
  }

  get isTeacher(): boolean {
    const roleId = this.userForm.get('roleId')?.value;
    const role = this.roles.find(r => r.id === Number(roleId));
    return role?.name.toUpperCase() === this.ROLE_TEACHER;
  }

  get isAssistant(): boolean {
    const roleId = this.userForm.get('roleId')?.value;
    const role = this.roles.find(r => r.id === Number(roleId));
    return role?.name.toUpperCase() === this.ROLE_ASSISTANT;
  }

  get showAreaField(): boolean {
    return this.isTeacher || this.isAssistant;
  }

  /**
   * Maneja el envío del formulario
   */
  handleSubmit(): void {
    this.submitted = true;

    if (this.userForm.invalid) {
      this.markFormGroupTouched(this.userForm);
      return;
    }

    const formValue = this.userForm.value;
    
    // Limpiar campos no relevantes según el rol
    const userData: User = {
      username: formValue.username,
      name: formValue.name,
      lastName: formValue.lastName,
      email: formValue.email,
      phone: formValue.phone,
      roleId: Number(formValue.roleId),
      ...(formValue.password && { password: formValue.password })
    };

    // Agregar campos específicos según el rol
    if (this.showAreaField) {
      userData.areaId = Number(formValue.areaId);
    }

    if (this.isStudent) {
      userData.studentId = formValue.studentId;
      userData.semester = Number(formValue.semester);
    } else if (this.isTeacher) {
      userData.specialty = formValue.specialty;
      userData.yearsOfExperience = Number(formValue.yearsOfExperience);
    } else if (this.isAssistant) {
      userData.position = formValue.position;
    }

    if (this.isEditMode && this.user?.id) {
      userData.id = this.user.id;
    }

    this.onSubmit.emit(userData);
  }

  /**
   * Marca todos los campos del formulario como tocados para mostrar errores
   */
  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  /**
   * Maneja la cancelación del formulario
   */
  handleCancel(): void {
    this.onCancel.emit();
    this.userForm.reset();
    this.submitted = false;
  }

  /**
   * Verifica si un campo tiene errores y ha sido tocado
   */
  hasError(fieldName: string): boolean {
    const field = this.userForm.get(fieldName);
    return !!(field && field.invalid && (field.touched || this.submitted));
  }

  /**
   * Obtiene el mensaje de error para un campo específico
   */
  getErrorMessage(fieldName: string): string {
    const field = this.userForm.get(fieldName);
    if (!field || !field.errors) return '';

    const errors = field.errors;

    if (errors['required']) return 'Este campo es requerido';
    if (errors['email']) return 'Email inválido';
    if (errors['minlength']) return `Mínimo ${errors['minlength'].requiredLength} caracteres`;
    if (errors['maxlength']) return `Máximo ${errors['maxlength'].requiredLength} caracteres`;
    if (errors['pattern']) return 'Formato inválido';
    if (errors['min']) return `Valor mínimo: ${errors['min'].min}`;
    if (errors['max']) return `Valor máximo: ${errors['max'].max}`;

    return 'Campo inválido';
  }

  /**
   * Verifica si las contraseñas no coinciden
   */
  get passwordMismatch(): boolean {
    return !!(this.userForm.errors?.['passwordMismatch'] && 
             (this.userForm.get('confirmPassword')?.touched || this.submitted));
  }
}

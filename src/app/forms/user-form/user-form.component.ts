import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CreateStudentDTO, CreateUserDTO, StudentProfile, User } from '../../models/user';
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
  @Output() onSubmit = new EventEmitter<CreateUserDTO>();
  @Output() onCancel = new EventEmitter<void>();

  userForm!: FormGroup;
  roles: Role[] = [];
  areas: Area[] = [];
  loading: boolean = false;
  submitted: boolean = false;

  // Tipos de rol según nombre (ajusta según tu backend)
  readonly ROLE_STUDENT = 'STUDENT';

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
      email: ['', [Validators.required, Validators.email]],
      username: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      firstName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      secondName: [''],
      lastName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      secondLastName: [''],
      documentNumber: ['', [Validators.required]],
      documentTypeId: ['', [Validators.required]],
      phone: [''],
      password: ['', this.isEditMode ? [] : [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', this.isEditMode ? [] : [Validators.required]],
      roleIds: [[], Validators.required],
      
      // Campos específicos de estudiante
      studentCode: [''],
      semester: [''],
      enrollmentDate: [''],
      university: ['']
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
    this.userForm.get('roleIds')?.valueChanges.subscribe((roleIds) => {
      this.updateFieldValidators(roleIds);
    });
  }

  /**
   * Actualiza los validadores de los campos según el rol seleccionado
   */
  private updateFieldValidators(roleIds: number[]): void {
    if (!roleIds || roleIds.length === 0) return;

    const selectedRole = this.roles.find(r => roleIds.includes(r.id));
    if (!selectedRole) return;

    const roleName = selectedRole.name.toUpperCase();

    // Limpiar todos los validadores específicos
    this.clearConditionalValidators();

    // Aplicar validadores según el rol
    if (roleName === this.ROLE_STUDENT) {
      this.userForm.get('studentCode')?.setValidators([Validators.required]);
      this.userForm.get('semester')?.setValidators([Validators.required, Validators.min(1), Validators.max(12)]);
      this.userForm.get('enrollmentDate')?.setValidators([Validators.required]);
      this.userForm.get('university')?.setValidators([Validators.required]);
    }

    // Actualizar la validez de los campos
    this.updateFieldsValidity();
  }

  /**
   * Limpia los validadores condicionales
   */
  private clearConditionalValidators(): void {
    this.userForm.get('studentCode')?.clearValidators();
    this.userForm.get('semester')?.clearValidators();
    this.userForm.get('enrollmentDate')?.clearValidators();
    this.userForm.get('university')?.clearValidators();
  }

  /**
   * Actualiza la validez de todos los campos condicionales
   */
  private updateFieldsValidity(): void {
    this.userForm.get('studentCode')?.updateValueAndValidity();
    this.userForm.get('semester')?.updateValueAndValidity();
    this.userForm.get('enrollmentDate')?.updateValueAndValidity();
    this.userForm.get('university')?.updateValueAndValidity();
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
      email: this.user.email,
      firstName: this.user.firstName,
      secondName: this.user.secondName,
      lastName: this.user.lastName,
      secondLastName: this.user.secondLastName,
      documentNumber: this.user.documentNumber,
      documentTypeId: this.user.documentTypeId,
      phone: this.user.phone,
      roleIds: this.user.roles?.map(r => r.id) || [],
      studentCode: this.user.studentProfile?.studentCode,
      semester: this.user.studentProfile?.semester,
      enrollmentDate: this.user.studentProfile?.enrollmentDate,
      university: this.user.studentProfile?.university
    });
  }

  /**
   * Determina si se deben mostrar campos específicos según el rol
   */
  get isStudent(): boolean {
    const roleIds = this.userForm.get('roleIds')?.value || [];
    const role = this.roles.find(r => roleIds.includes(r.id));
    return role?.name.toUpperCase() === this.ROLE_STUDENT;
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
    
    const userData: CreateUserDTO = {
      email: formValue.email,
      username: formValue.username,
      firstName: formValue.firstName,
      secondName: formValue.secondName,
      lastName: formValue.lastName,
      secondLastName: formValue.secondLastName,
      documentNumber: formValue.documentNumber,
      documentTypeId: Number(formValue.documentTypeId),
      roleIds: [Number(formValue.roleIds)],
      password: formValue.password,
      phone: formValue.phone
    }

    if (this.isStudent) {
      userData.studentProfile = {
        studentCode: formValue.studentCode,
        semester: Number(formValue.semester),
        enrollmentDate: formValue.enrollmentDate,
        university: formValue.university
      };
    }

    if (this.isEditMode && this.user?.id) {
      (userData as any).id = this.user.id;
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

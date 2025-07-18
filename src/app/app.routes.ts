import { Routes } from '@angular/router';
export const routes: Routes = [
    { path: '', loadComponent: () => import('./views/cases-overview/cases-overview.component')},
    { path: 'datos-cliente', loadComponent: () => import('./forms/reg-client/reg-client.component')},
    { path: 'socioeconomico', loadComponent: () => import('./forms/socioeconomic-form/socioeconomic-form.component')},
    { path: 'entrevista', loadComponent: () => import('./forms/interview-form/interview-form.component')},
    { path: 'dashboard/:id', loadComponent: () => import('./views/dashboard/dashboard.component')},
    { path: 'registro', loadComponent: () => import('./forms/user-sign-up/user-sign-up.component')}, 
    { path: 'login', loadComponent: () => import('./forms/login/login.component')},
    { path: 'select-role', loadComponent: () => import('./forms/select-role/select-role.component').then(m => m.default) },
    { path: 'perfil-teacher', loadComponent: () => import('./forms/perfil-teacher/perfil-teacher.component').then(m => m.default) },
    { path: 'perfil-assistant', loadComponent: () => import('./forms/perfil-assistant/perfil-assistant.component').then(m => m.default) },
    { path: 'perfil-student', loadComponent: () => import('./forms/perfil-student/perfil-student.component').then(m => m.default) },
];

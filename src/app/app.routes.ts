import { Routes } from '@angular/router';
export const routes: Routes = [
    { path: '', loadComponent: () => import('./views/cases-overview/cases-overview.component')},
    { path: 'datos-cliente', loadComponent: () => import('./forms/reg-client/reg-client.component')},
    { path: 'socioeconomico', loadComponent: () => import('./forms/socioeconomic-form/socioeconomic-form.component')},
    { path: 'entrevista', loadComponent: () => import('./forms/interview-form/interview-form.component')},
    { path: 'dashboard/:id', loadComponent: () => import('./views/dashboard/dashboard.component')},
    { path: 'registro', loadComponent: () => import('./forms/user-sign-up/user-sign-up.component')}, 
    { path: 'users', loadComponent: () => import('./views/users-managment/users-managment.component')},
    { path: 'login', loadComponent: () => import('./forms/login/login.component')},
    { path: 'home', loadComponent: () => import('./views/home/home.component')},
];

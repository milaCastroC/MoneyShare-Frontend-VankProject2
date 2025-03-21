// app.routes.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },//Ruta principal
    { path: 'login', component: LoginComponent}, //Ruta Login
    { path: 'register', component: RegisterComponent }, // Ruta Registro
];

// @NgModule({
//     imports: [RouterModule.forRoot(routes)],
//     exports: [RouterModule]
// })
export class AppRoutingModule { }
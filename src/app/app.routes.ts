// app.routes.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { InicioComponent } from './components/inicio/inicio.component';
import { CreateShareExpenseComponent } from './components/create-share-expense/create-share-expense.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },//Ruta principal
    { path: 'login', component: LoginComponent}, //Ruta Login
    { path: 'register', component: RegisterComponent }, // Ruta Registro
    { path: 'inicio', component: InicioComponent }, // Ruta Inicio
    { path: 'create-expense', component: CreateShareExpenseComponent }, // Ruta Crear Gasto
];

// @NgModule({
//     imports: [RouterModule.forRoot(routes)],
//     exports: [RouterModule]
// })
export class AppRoutingModule { }
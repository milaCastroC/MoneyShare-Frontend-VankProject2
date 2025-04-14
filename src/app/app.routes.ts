// app.routes.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { InicioComponent } from './components/inicio/inicio.component';
import { CreateShareExpenseComponent } from './components/create-share-expense/create-share-expense.component';
import { ShareExpenseDetailComponent } from './components/share-expense-detail/share-expense-detail.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },//Ruta principal
    { path: 'login', component: LoginComponent}, //Ruta Login
    { path: 'register', component: RegisterComponent }, // Ruta Registro
    { path: 'inicio', component: InicioComponent }, // Ruta Inicio
    { path: 'create-expense', component: CreateShareExpenseComponent }, // Ruta Crear Gasto
    { path: 'share-expense/:id', component: ShareExpenseDetailComponent }, // Ruta Detalle Gasto Compartido
];

// @NgModule({
//     imports: [RouterModule.forRoot(routes)],
//     exports: [RouterModule]
// })
export class AppRoutingModule { }
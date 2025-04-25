// app.routes.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { InicioComponent } from './components/inicio/inicio.component';
import { CreateShareExpenseComponent } from './components/create-share-expense/create-share-expense.component';
import { ShareExpenseDetailComponent } from './components/share-expense-detail/share-expense-detail.component';
import { CreateExpenseComponent } from './components/create-expense/create-expense.component';
import { EditShareExpenseComponent } from './components/edit-share/edit-share.component';
import { NotFoundComponent } from './not-found/not-found.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },//Ruta principal
    { path: 'login', component: LoginComponent}, //Ruta Login
    { path: 'register', component: RegisterComponent }, // Ruta Registro
    { path: 'inicio', component: InicioComponent }, // Ruta Inicio
    { path: 'create-shareexpense', component: CreateShareExpenseComponent }, // Ruta Crear Gasto
    { path: 'share-expense/:id', component: ShareExpenseDetailComponent }, // Ruta Detalle Gasto Compartido
    { path: 'create-expense/:id', component: CreateExpenseComponent }, // Ruta Crear Gasto
    { path: 'edit-share-expense/:id', component: EditShareExpenseComponent }, // Ruta Editar Gasto Compartido
    { path: '**', component: NotFoundComponent } // Ruta 404 - debe ser la última ruta
];

// @NgModule({
//     imports: [RouterModule.forRoot(routes)],
//     exports: [RouterModule]
// })
export class AppRoutingModule { }
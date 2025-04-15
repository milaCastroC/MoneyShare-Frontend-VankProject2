import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AppHeaderComponent } from "../app-header/app-header.component";

@Component({
  selector: 'app-create-expense',
  standalone: true,
  imports: [CommonModule, FormsModule, AppHeaderComponent],
  templateUrl: './create-expense.component.html',
  styleUrls: ['./create-expense.component.css']
})
export class CreateExpenseComponent {
  expenseName: string = '';
  expenseAmount: number | null = null;
  
  constructor(private router: Router) { }
  
  createShare(): void {
    // Validar que los campos no estén vacíos
    if (!this.expenseName.trim()) {
      alert('Por favor, ingresa un nombre para el gasto');
      return;
    }
    
    if (!this.expenseAmount || this.expenseAmount <= 0) {
      alert('Por favor, ingresa un monto válido para el gasto');
      return;
    }
    
    // Aquí se implementaría la lógica para crear el gasto en la base de datos
    console.log('Creando gasto:', {
      name: this.expenseName,
      amount: this.expenseAmount
    });
    
    // Simulación de creación exitosa
    alert('Gasto creado con éxito');
    
    // Redirigir al usuario a la página de inicio o al detalle del nuevo gasto
    this.router.navigate(['/home']);
  }
  
  goBack(): void {
    this.router.navigate(['/home']);
  }
  
  logout(): void {
    // Implementar lógica de cierre de sesión
    this.router.navigate(['/login']);
  }
}
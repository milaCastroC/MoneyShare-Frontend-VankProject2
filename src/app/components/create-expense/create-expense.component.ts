import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { AppHeaderComponent } from "../app-header/app-header.component";
import { Expense } from '../../models/expense.model';
import { UsuarioService } from '../../services/usuario.service';
import { ExpenseService } from '../../services/expense.service';

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
expenseCategory: any;

  
  constructor(private router: Router, private route: ActivatedRoute,
    private usuarioService: UsuarioService,
    private expenseService: ExpenseService
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    console.log('ShareExpense ID:', id);
  }
  
    createShare(): void {
    if (!this.expenseName.trim()) {
      alert('Por favor, ingresa un nombre para el gasto');
      return;
    }

    if (!this.expenseAmount || this.expenseAmount <= 0) {
      alert('Por favor, ingresa un monto válido para el gasto');
      return;
    }

    const userEmail = this.usuarioService.getTokenInfo().email;
    if (!userEmail) {
      console.error('Error: userEmail is undefined');
      return;
    }

    this.usuarioService.getUsuarioByEmail(userEmail) 
      .then((response: any) => {
        console.log('Usuario logueado:', response.data);
        const userId = response.data.id_user;

        const expense: Expense = {
          description: this.expenseName,
          amount: Number(this.expenseAmount),
          category: this.expenseCategory,
          date: new Date().toISOString(),
          id_share: Number(this.route.snapshot.paramMap.get('id')),
          id_user: userId
        };

        this.expenseService.createExpense(expense)
          .then(() => {
            alert('Gasto creado con éxito');
            this.router.navigate(['/share-expense', this.route.snapshot.paramMap.get('id')]); 
          })
          .catch((error) => {
            console.error('Error al crear el gasto:', error);
            alert('Ocurrió un error al crear el gasto');
          });

      }).catch((error: any) => {
        console.error('Error obteniendo el usuario logueado:', error);
      });
  }
  
  goBack(): void {
    this.router.navigate(['/share-expense', this.route.snapshot.paramMap.get('id')]);
  }
  
  logout(): void {
    this.router.navigate(['/login']);
  }
}
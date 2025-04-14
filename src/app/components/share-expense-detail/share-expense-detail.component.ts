import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';

interface SubExpense {
  id: number;
  category: string;
  amount: number;
  paidBy: string;
}

@Component({
  selector: 'app-share-expense-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './share-expense-detail.component.html',
  styleUrl: './share-expense-detail.component.css'
})
export class ShareExpenseDetailComponent implements OnInit{
  shareExpenseName: string = 'Nombre del ShareExpense';
  shareExpenseCode: string = 'FYUBI258135';
  totalAmount: number = 1000000;
  activeTab: 'subgastos' | 'balance' = 'subgastos';
  
  subExpenses: SubExpense[] = [
    { id: 1, category: 'Restaurantes y comida', amount: 500000, paidBy: 'Fulanito' },
    { id: 2, category: 'Hotel', amount: 300000, paidBy: 'Juancho' },
    { id: 3, category: 'Transporte', amount: 200000, paidBy: 'Juanita' }
  ];

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    // Aquí se cargarían los datos del ShareExpense desde un servicio
    // usando el ID que vendría en la URL
    const id = this.route.snapshot.paramMap.get('id');
    console.log('ShareExpense ID:', id);
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('es-CO', { 
      style: 'currency', 
      currency: 'COP',
      maximumFractionDigits: 0 
    }).format(amount);
  }

  copyCode(): void {
    navigator.clipboard.writeText(this.shareExpenseCode)
      .then(() => {
        alert('Código copiado al portapapeles');
      })
      .catch(err => {
        console.error('Error al copiar el código:', err);
      });
  }

  setActiveTab(tab: 'subgastos' | 'balance'): void {
    this.activeTab = tab;
  }

  addSubExpense(): void {
    // Aquí se implementaría la lógica para agregar un nuevo subgasto
    console.log('Agregar subgasto');
  }

  goBack(): void {
    this.router.navigate(['/home']);
  }

  logout(): void {
    // Implementar lógica de cierre de sesión
    this.router.navigate(['/login']);
  }

  calculateProgress(): number {
    // Calcular el porcentaje de progreso (ejemplo simple)
    const totalPaid = this.subExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    return (totalPaid / this.totalAmount) * 100;
  }

}

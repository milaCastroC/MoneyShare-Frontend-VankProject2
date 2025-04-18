import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { PayDebtModalComponent } from '../pay-debt-modal/pay-debt-modal.component';
import { RegisterPaymentModalComponent } from '../register-payment-modal/register-payment-modal.component';
import { AppHeaderComponent } from "../app-header/app-header.component";

interface SubExpense {
  id: number;
  category: string;
  amount: number;
  paidBy: string;
}

interface UserBalance {
  id: number;
  name: string;
  balance: number;
  avatar?: string;
}

@Component({
  selector: 'app-share-expense-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, PayDebtModalComponent, RegisterPaymentModalComponent, AppHeaderComponent],
  templateUrl: './share-expense-detail.component.html',
  styleUrls: ['./share-expense-detail.component.css']
})
export class ShareExpenseDetailComponent implements OnInit {
  shareExpenseName: string = 'Nombre del ShareExpense';
  shareExpenseCode: string = 'FYUBI258135';
  totalAmount: number = 1000000;
  paidAmount: number = 200000;
  activeTab: 'subgastos' | 'balance' = 'subgastos';
  
  // Datos para la pestaña de subgastos
  subExpenses: SubExpense[] = [
    { id: 1, category: 'Restaurantes y comida', amount: 500000, paidBy: 'Fulanito' },
    { id: 2, category: 'Hotel', amount: 300000, paidBy: 'Juancho' },
    { id: 3, category: 'Transporte', amount: 200000, paidBy: 'Juanita' }
  ];

  // Datos para la pestaña de balance
  youOwe: number = 20000;
  theyOweYou: number = 20000;
  userBalances: UserBalance[] = [
    { id: 1, name: 'Fulanito', balance: 200000 },
    { id: 2, name: 'Juanita', balance: -28900 },
    { id: 3, name: 'Juancho', balance: -15500 }
  ];

  // Estado de los modales
  showPayDebtModal: boolean = false;
  showRegisterPaymentModal: boolean = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    // Aquí se cargarían los datos del ShareExpense desde un servicio
    // usando el ID que vendría en la URL
    const id = this.route.snapshot.paramMap.get('id');
    console.log('ShareExpense ID:', id);
    
    // Verificar si hay un parámetro de tab en la URL
    const tab = this.route.snapshot.queryParamMap.get('tab');
    if (tab === 'balance') {
      this.activeTab = 'balance';
    }
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
    // Actualizar la URL sin recargar la página
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { tab: tab },
      queryParamsHandling: 'merge'
    });
  }

  addSubExpense(): void {
    // Aquí se implementaría la lógica para agregar un nuevo subgasto
    console.log('Agregar subgasto');
    this.router.navigate(['/create-expense', this.route.snapshot.paramMap.get('id')]);
  }

  payDebt(): void {
    // Abrir el modal de pago
    this.showPayDebtModal = true;
  }

  closePayDebtModal(): void {
    this.showPayDebtModal = false;
  }

  handlePaymentConfirmed(paymentData: {userId: number, amount: number}): void {
    console.log('Pago confirmado:', paymentData);
    
    // Aquí se implementaría la lógica para procesar el pago
    // Por ejemplo, actualizar el balance del usuario y reducir la deuda
    
    // Cerrar el modal después de procesar el pago
    this.showPayDebtModal = false;
    
    // Mostrar un mensaje de confirmación
    alert(`Pago de ${this.formatCurrency(paymentData.amount)} realizado con éxito`);
    
    // Actualizar los datos (simulación)
    this.youOwe -= paymentData.amount;
    if (this.youOwe < 0) this.youOwe = 0;
    
    // Actualizar el balance del usuario que recibió el pago
    const userIndex = this.userBalances.findIndex(user => user.id === paymentData.userId);
    if (userIndex !== -1) {
      this.userBalances[userIndex].balance += paymentData.amount;
    }
  }

  registerPayment(): void {
    // Abrir el modal de registro de pago
    this.showRegisterPaymentModal = true;
  }

  closeRegisterPaymentModal(): void {
    this.showRegisterPaymentModal = false;
  }

  handlePaymentRegistered(paymentData: {userId: number, amount: number}): void {
    console.log('Pago registrado:', paymentData);
    
    // Aquí se implementaría la lógica para procesar el registro de pago
    // Por ejemplo, actualizar el balance del usuario y reducir lo que te deben
    
    // Cerrar el modal después de procesar el registro
    this.showRegisterPaymentModal = false;
    
    // Mostrar un mensaje de confirmación
    alert(`Pago de ${this.formatCurrency(paymentData.amount)} registrado con éxito`);
    
    // Actualizar los datos (simulación)
    this.theyOweYou -= paymentData.amount;
    if (this.theyOweYou < 0) this.theyOweYou = 0;
    
    // Actualizar el balance del usuario que realizó el pago
    const userIndex = this.userBalances.findIndex(user => user.id === paymentData.userId);
    if (userIndex !== -1) {
      this.userBalances[userIndex].balance += paymentData.amount;
    }
  }

  goBack(): void {
    this.router.navigate(['/inicio']);
  }

  logout(): void {
    // Implementar lógica de cierre de sesión
    this.router.navigate(['/login']);
  }

  calculateProgress(): number {
    // Calcular el porcentaje de progreso
    return (this.paidAmount / this.totalAmount) * 100;
  }

  // Obtener solo los usuarios con balance negativo (a quienes les debes)
  getUsersYouOwe(): {id: number, name: string}[] {
    return this.userBalances
      .filter(user => user.balance > 0)
      .map(user => ({
        id: user.id,
        name: user.name
      }));
  }

  // Obtener solo los usuarios con balance negativo (quienes te deben)
  getUsersWhoOweYou(): {id: number, name: string}[] {
    return this.userBalances
      .filter(user => user.balance < 0)
      .map(user => ({
        id: user.id,
        name: user.name
      }));
  }

  // Añadir este método al componente ShareExpenseDetailComponent
editShareExpense(): void {
  if (this.route.snapshot.paramMap.get('id')) {
    this.router.navigate(['/edit-share-expense', this.route.snapshot.paramMap.get('id')]);
  }
}
}
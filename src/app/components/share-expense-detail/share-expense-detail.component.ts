import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { PayDebtModalComponent } from '../pay-debt-modal/pay-debt-modal.component';
import { RegisterPaymentModalComponent } from '../register-payment-modal/register-payment-modal.component';
import { AppHeaderComponent } from "../app-header/app-header.component";
import { ShareService } from '../../services/share.service';
import { ExpenseService } from '../../services/expense.service';
import { UsuarioService } from '../../services/usuario.service';
import { ShareMember } from '../../models/share-member.model';

interface SubExpense {
  id: number;
  category: string;
  description: string;
  amount: number;
  paidBy?: string;
  userId?: number;
}

@Component({
  selector: 'app-share-expense-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, PayDebtModalComponent, RegisterPaymentModalComponent, AppHeaderComponent],
  templateUrl: './share-expense-detail.component.html',
  styleUrls: ['./share-expense-detail.component.css']
})

export class ShareExpenseDetailComponent implements OnInit {
  shareExpenseName: string = '';
  shareExpenseCode: string = '';
  totalAmount: number = 0;
  paidAmount: number = 0;
  activeTab: 'subgastos' | 'balance' = 'subgastos';
  // Datos para la pestaña de subgastos
  subExpenses: SubExpense[] = [];

  // Datos para la pestaña de balance

  youOwe: number = 0;
  theyOweYou: number = 0;
  userBalances: ShareMember[] = [];

  // Estado de los modales
  showPayDebtModal: boolean = false;
  showRegisterPaymentModal: boolean = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private shareService: ShareService,
    private expenseService: ExpenseService,
    private usuarioService: UsuarioService
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.getShareData(id);
    }


    const tab = this.route.snapshot.queryParamMap.get('tab');
    if (tab === 'balance') {
      this.activeTab = 'balance';
    }
  }

  getShareData(id: string){
    this.shareService.findShareById(id)
        .then((res: any) => {
          this.shareExpenseName = res.data.name;
          this.shareExpenseCode = res.data.code;
          this.getUserBalances(parseInt(id));
          this.totalAmount = res.data.paid_amount;
          this.calculateProgress();
          console.log(this.userBalances);
          this.userBalances.forEach(user => {
            console.log(user.balance);
          });
        })
        .catch(err => {
          console.error('Error al obtener el share:', err);
          if (err.response) {
            console.error('Status:', err.response.status);
            console.error('Mensaje del servidor:', err.response.data);
          }
        });

      this.expenseService.getExpensesByShareId(id)
        .then((res: any) => {
          console.log('Respuesta de expenses:', res);

          this.subExpenses = res.data.map((expense: any) => ({
            id: expense.id_expense,
            description: expense.description,
            category: expense.category,
            amount: expense.amount,
            userId: expense.id_user
          }));

          this.subExpenses.forEach(expense => {
            if (expense.userId) {
              this.getUsername(expense);
            }
          });
          console.log('SubExpenses procesados:', this.subExpenses);

          //this.calculateTotalAmount();
          console.log('Total Amount:', this.totalAmount);
        })
        .catch(err => {
          console.error('Error al obtener los gastos:', err);
        });
        console.log('Holi');
        
  }

  setOwnBalance(userBalance: ShareMember) {
    if (userBalance.balance < 0) {
      this.youOwe = userBalance.balance;
    } else {
      this.theyOweYou = userBalance.balance;
    }
  }

  getUsername(expense: SubExpense): void {
    if (expense.userId) {
      this.usuarioService.getUsuarioById(expense.userId)
        .then((response: any) => {
          expense.paidBy = response.data.username;
        })
        .catch(error => {
          console.error(`Error obteniendo el nombre del usuario ${expense.userId}:`, error);
          expense.paidBy = `Usuario ${expense.userId}`;
        });
    }
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0
    }).format(amount);
  }

  getUserBalances(idShare: number) {
    this.shareService.findShareMemebers(idShare)
      .then((response: any) => {
        this.userBalances = response.data;
        console.log(response.data);
        this.userBalances.forEach(user => {
          if(user.email_user === this.usuarioService.getTokenInfo().email){
            this.setOwnBalance(user);
          }
        });
        this.calculatedPaidAmount();
      })
      .catch((error: any) => {
        console.error('Error getting user balances:', error);
      });
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

  handlePaymentConfirmed(paymentData: { userId: number, amount: number }): void {
    this.closePayDebtModal();
    this.getShareData(this.route.snapshot.paramMap.get('id')!);
    console.log(this.route.snapshot.paramMap.get('id')!);
    
    alert(`Pago de ${this.formatCurrency(paymentData.amount)} realizado con éxito`);
  }

  registerPayment(): void {
    // Abrir el modal de registro de pago
    this.showRegisterPaymentModal = true;
  }

  closeRegisterPaymentModal(): void {
    this.showRegisterPaymentModal = false;
  }

  handlePaymentRegistered(paymentData: { userId: number, amount: number }): void {
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
    const userIndex = this.userBalances.findIndex(user => user.id_user === paymentData.userId);
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

  calculateTotalAmount(): void{
    this.totalAmount = this.subExpenses.reduce((total, expense) => total + expense.amount, 0);
  }

  calculatedPaidAmount(): void{
    let totalPaid = 0;
    let debt = 0;
    this.userBalances
    .forEach(user => {
      totalPaid += Math.abs(user.paid);
      if(user.balance < 0){
        debt += Math.abs(user.balance);
      }
    });
    this.paidAmount = totalPaid - debt;
    };
    // .filter(user => user.balance > 0)
    // .reduce((sum, user) => sum + user.balance, 0);
  

  calculateProgress(): number {
    if(this.totalAmount === 0) return 100;
    return (this.paidAmount / this.totalAmount) * 100;
  }
  

  // Obtener solo los usuarios con balance negativo (a quienes les debes)
  getUsersYouOwe(): { id: number, name: string }[] {
    return this.userBalances
      .filter(user => user.balance > 0)
      .map(user => ({
        id: user.id_user,
        name: user.username
      }));
  }

  // Obtener solo los usuarios con balance negativo (quienes te deben)
  getUsersWhoOweYou(): { id: number, name: string }[] {
    return this.userBalances
      .filter(user => user.balance < 0)
      .map(user => ({
        id: user.id_user,
        name: user.username
      }));
  }

  // Añadir este método al componente ShareExpenseDetailComponent
  editShareExpense(): void {
    if (this.route.snapshot.paramMap.get('id')) {
      this.router.navigate(['/edit-share-expense', this.route.snapshot.paramMap.get('id')]);
    }
  }
}
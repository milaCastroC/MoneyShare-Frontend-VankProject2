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
  buttonEditMessage: string = '';
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

  showEditButton(adminId: number) {
    const userEmail = this.usuarioService.getTokenInfo().email;
    if (userEmail) {
      this.usuarioService.getUsuarioByEmail(userEmail)
        .then((res: any) => {
          if (res.data.id_user === adminId) {
            this.buttonEditMessage = '✎ Editar';
          } else {
            this.buttonEditMessage = '🛈 Info';
          }
        });
    } else {
      this.buttonEditMessage = '🛈 Info';
    }
  
  }

  getShareData(id: string){
    // Retraso para asegurar que el backend haya procesado el pago
    setTimeout(() => {
      Promise.all([
        this.shareService.findShareById(id),
        this.expenseService.getExpensesByShareId(id)
      ])
      .then(([shareResponse, expensesResponse]: [any, any]) => {
        // Procesar datos del share
        this.shareExpenseName = shareResponse.data.name;
        this.shareExpenseCode = shareResponse.data.code;
        this.getUserBalances(parseInt(id));
        this.totalAmount = shareResponse.data.paid_amount;
        this.calculateProgress();
        this.showEditButton(shareResponse.data.id_creator);

        // Procesar datos de los gastos
        this.subExpenses = expensesResponse.data.map((expense: any) => ({
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
      })
      .catch(err => {
        console.error('Error al obtener los datos:', err);
        if (err.response) {
          console.error('Status:', err.response.status);
          console.error('Mensaje del servidor:', err.response.data);
        }
        // Intentar nuevamente después de un error
        setTimeout(() => this.getShareData(id), 1000);
      });
    }, 500);
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
    
    alert(`Pago de ${this.formatCurrency(paymentData.amount)} realizado con éxito`);
  }

  registerPayment(): void {
    this.showRegisterPaymentModal = true;
  }

  closeRegisterPaymentModal(): void {
    this.showRegisterPaymentModal = false;
  }

  handlePaymentRegistered(paymentData: { userId: number, amount: number }): void {
    this.closeRegisterPaymentModal();
    this.getShareData(this.route.snapshot.paramMap.get('id')!);

    alert(`Pago de ${this.formatCurrency(paymentData.amount)} registrado con éxito`);

  }

  goBack(): void {
    this.router.navigate(['/inicio']);
  }

  logout(): void {
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

  

  calculateProgress(): number {
    if(this.totalAmount === 0) return 100;
    return (this.paidAmount / this.totalAmount) * 100;
  }
  

  // Obtener solo los usuarios con balance negativo (a quienes les debes)
  getUsersYouOwe():ShareMember[] {
    return this.userBalances.filter(user => user.balance > 0);
  }

  // Obtener solo los usuarios con balance negativo (quienes te deben)
  getUsersWhoOweYou():ShareMember[] {
    return this.userBalances.filter(user => user.balance < 0);
  }

  // Añadir este método al componente ShareExpenseDetailComponent
  editShareExpense(): void {
    if (this.route.snapshot.paramMap.get('id')) {
      this.router.navigate(['/edit-share-expense', this.route.snapshot.paramMap.get('id')]);
    }
  }
}
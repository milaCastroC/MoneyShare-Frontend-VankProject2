import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ShareMember } from '../../models/share-member.model';
import { UsuarioService } from '../../services/usuario.service';
import { ActivatedRoute } from '@angular/router';
import { Payment } from '../../models/payment.model';
import { ShareService } from '../../services/share.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register-payment-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register-payment-modal.component.html',
  styleUrls: ['./register-payment-modal.component.css']
})
export class RegisterPaymentModalComponent implements OnInit {
  @Input() totalOwed: number = 0;
  @Input() users: ShareMember[] = [];
  @Output() close = new EventEmitter<void>();
  @Output() paymentRegistered = new EventEmitter<{userId: number, amount: number}>();
  
  selectedUser: ShareMember | null = null;
  paymentAmount: number = 0;
  maxAmount: number = 0;
  loggedUserId: number = 0;

  constructor(
    private usuarioService: UsuarioService, 
    private shareService: ShareService, 
    private route: ActivatedRoute,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    // Inicializar el monto de pago con el total que te deben
    this.paymentAmount = Math.abs(this.totalOwed);
    this.totalOwed = Math.abs(this.totalOwed);
    this.maxAmount = Math.abs(this.totalOwed);
    this.setLoggedUserId();
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('es-CO', { 
      style: 'currency', 
      currency: 'COP',
      maximumFractionDigits: 0 
    }).format(amount);
  }

  setLoggedUserId() {
    const userEmail = this.usuarioService.getTokenInfo().email;
    if (!userEmail) {
      console.error('Error: userEmail is undefined');
      return;
    }

    this.usuarioService.getUsuarioByEmail(userEmail) 
      .then((response: any) => {
        const userId = response.data.id_user;
        this.loggedUserId = userId;
      }).catch((error: any) => {
        console.error('Error obteniendo el usuario logueado:', error);
      });
  }

  onUserSelected(user: ShareMember): void {
    this.selectedUser = user;

    
    if(this.selectedUser){
      if(Math.abs(Number(this.selectedUser.balance)) < Math.abs(Number(this.totalOwed))){        
        this.paymentAmount = Math.abs(Number(this.selectedUser.balance));
        this.maxAmount = Math.abs(Number(this.selectedUser.balance));
      } else {
        this.paymentAmount = Math.abs(Number(this.maxAmount));
        this.maxAmount = Math.abs(Number(this.totalOwed));
      }
    }

  }

  onAmountChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.paymentAmount = parseInt(inputElement.value) || 0;
    
    // Asegurar que el monto no exceda la deuda total
    /**if (this.paymentAmount > this.maxAmount) {
      this.paymentAmount = this.maxAmount;
    }*/
  }

  confirmPayment(): void {
    if(this.selectedUser === null){
      this.showInfo('Debes seleccionar un usuario'); 
      return;
    }

    if (this.selectedUser !== null && this.paymentAmount > 0) {
      
      if(this.paymentAmount > this.maxAmount){
        this.showError('El monto a pagar no puede ser mayor que la deuda total'); 
        return;
      }
      
      let payment: Payment = {
        id_share: Number(this.route.snapshot.paramMap.get('id')),
        amount_to_pay: this.paymentAmount,
        paying_user_id: this.selectedUser.id_user,
        paid_user_id: this.loggedUserId
      }
      this.shareService.makePayment(payment)
        .then(() => {
          this.showSuccess('Pago registrado con éxito'); 
        })
        .catch((error: any) => {
          console.error('Error al registrar el pago:', error);
          this.showError('Ocurrió un error al registrar el pago'); 
        });
        this.paymentRegistered.emit({
          userId: this.loggedUserId,
          amount: this.paymentAmount
        });
    }
  }

  closeModal(): void {
    this.close.emit();
  }

  showError(message: string): void {
    this.toastr.error(message);
  }

  showSuccess(message: string): void {
    this.toastr.success(message);
  }

  showInfo(message: string): void {
    this.toastr.info(message);
  }
}

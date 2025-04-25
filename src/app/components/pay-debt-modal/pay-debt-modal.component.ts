import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsuarioService } from '../../services/usuario.service';
import { ShareService } from '../../services/share.service';
import { Payment } from '../../models/payment.model';
import { ActivatedRoute } from '@angular/router';
import { ShareMember } from '../../models/share-member.model';


@Component({
  selector: 'app-pay-debt-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pay-debt-modal.component.html',
  styleUrl: './pay-debt-modal.component.css'
})
export class PayDebtModalComponent implements OnInit {
  @Input() totalDebt: number = 0;
  @Input() users: ShareMember[] = [];
  @Output() close = new EventEmitter<void>();
  @Output() paymentConfirmed = new EventEmitter<{userId: number, amount: number}>();
  
  selectedUser: ShareMember | null = null;
  paymentAmount: number = 0;
  maxAmount: number = 0;
  loggedUserId: number = 0;

  constructor(private usuarioService: UsuarioService, private shareService: ShareService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    // Inicializar el monto de pago con el total de la deuda
    this.paymentAmount = Math.abs(this.totalDebt);
    this.totalDebt = Math.abs(this.totalDebt);
    this.maxAmount = Math.abs(this.totalDebt);
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
      if(Number(this.selectedUser.balance) < Number(this.totalDebt)){        
        this.paymentAmount = Number(this.selectedUser.balance);
        this.maxAmount = Number(this.selectedUser.balance);
      } else {
        this.paymentAmount = Number(this.maxAmount);
        this.maxAmount = Number(this.totalDebt);
      }
    }

  }

  onAmountChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.paymentAmount = parseInt(inputElement.value) || 0;
    // Asegurar que el monto no exceda la deuda total
    /*
    if (Number(this.paymentAmount) > Number(this.maxAmount)) {
      this.paymentAmount = this.maxAmount;
    }*/
  }

  confirmPayment(): void {

    if(this.selectedUser === null){
      alert('Debes seleccionar un usuario');
      return;
    }

    if (this.selectedUser !== null && this.paymentAmount > 0) {
      
      if(this.paymentAmount > this.maxAmount){
        alert('El monto a pagar no puede ser mayor que la deuda total');
        return;
      }
      
      let payment: Payment = {
        id_share: Number(this.route.snapshot.paramMap.get('id')),
        amount_to_pay: this.paymentAmount,
        paying_user_id: this.loggedUserId,
        paid_user_id: this.selectedUser.id_user
      }
      this.shareService.makePayment(payment)
        .then(() => {
          alert('Pago registrado con éxito');
        })
        .catch((error) => {
          console.error('Error al registrar el pago:', error);
          alert('Ocurrió un error al registrar el pago');
        });
        this.paymentConfirmed.emit({
          userId: this.loggedUserId,
          amount: this.paymentAmount
        });
    }
  }

  closeModal(): void {
    this.close.emit();
  }
}

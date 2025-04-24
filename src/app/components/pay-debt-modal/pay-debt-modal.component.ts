import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsuarioService } from '../../services/usuario.service';
import { ShareService } from '../../services/share.service';
import { Payment } from '../../models/payment.model';
import { ActivatedRoute } from '@angular/router';


interface User {
  id: number;
  name: string;
}

@Component({
  selector: 'app-pay-debt-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pay-debt-modal.component.html',
  styleUrl: './pay-debt-modal.component.css'
})
export class PayDebtModalComponent implements OnInit {
  @Input() totalDebt: number = 0;
  @Input() users: User[] = [];
  @Output() close = new EventEmitter<void>();
  @Output() paymentConfirmed = new EventEmitter<{userId: number, amount: number}>();
  
  selectedUserId: number | null = null;
  paymentAmount: number = 0;
  maxAmount: number = 0;
  loggedUserId: number = 0;

  constructor(private usuarioService: UsuarioService, private shareService: ShareService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    // Inicializar con el primer usuario si existe
    if (this.users.length > 0) {
      this.selectedUserId = this.users[0].id;
    }
    
    // Inicializar el monto de pago con el total de la deuda
    this.paymentAmount = Math.abs(this.totalDebt);
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
        console.log('Usuario logueado:', response.data);
        const userId = response.data.id_user;
        this.loggedUserId = userId;
      }).catch((error: any) => {
        console.error('Error obteniendo el usuario logueado:', error);
      });
  }

  onUserChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.selectedUserId = parseInt(selectElement.value);
    console.log(this.selectedUserId);
    
  }

  onAmountChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.paymentAmount = parseInt(inputElement.value) || 0;
    
    // Asegurar que el monto no exceda la deuda total
    if (this.paymentAmount > this.maxAmount) {
      this.paymentAmount = this.maxAmount;
    }
  }

  confirmPayment(): void {
    console.log('Entró al confirmar pago');
    console.log('Entró al confirmar pago 2');
      console.log(this.loggedUserId);
      console.log(this.selectedUserId);
      console.log(this.paymentAmount);
    if (this.selectedUserId !== null && this.paymentAmount > 0) {
      
      let payment: Payment = {
        id_share: Number(this.route.snapshot.paramMap.get('id')),
        amount_to_pay: this.paymentAmount,
        paying_user_id: this.loggedUserId,
        paid_user_id: this.selectedUserId
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

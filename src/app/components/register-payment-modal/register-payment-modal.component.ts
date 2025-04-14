import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface User {
  id: number;
  name: string;
}

@Component({
  selector: 'app-register-payment-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register-payment-modal.component.html',
  styleUrls: ['./register-payment-modal.component.css']
})
export class RegisterPaymentModalComponent implements OnInit {
  @Input() totalOwed: number = 0;
  @Input() users: User[] = [];
  @Output() close = new EventEmitter<void>();
  @Output() paymentRegistered = new EventEmitter<{userId: number, amount: number}>();
  
  selectedUserId: number | null = null;
  paymentAmount: number = 0;
  maxAmount: number = 0;

  constructor() { }

  ngOnInit(): void {
    // Inicializar con el primer usuario si existe
    if (this.users.length > 0) {
      this.selectedUserId = this.users[0].id;
    }
    
    // Inicializar el monto de pago con el total que te deben
    this.paymentAmount = this.totalOwed;
    this.maxAmount = this.totalOwed;
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('es-CO', { 
      style: 'currency', 
      currency: 'COP',
      maximumFractionDigits: 0 
    }).format(amount);
  }

  onUserChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.selectedUserId = parseInt(selectElement.value);
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
    if (this.selectedUserId !== null && this.paymentAmount > 0) {
      this.paymentRegistered.emit({
        userId: this.selectedUserId,
        amount: this.paymentAmount
      });
    }
  }

  closeModal(): void {
    this.close.emit();
  }
}

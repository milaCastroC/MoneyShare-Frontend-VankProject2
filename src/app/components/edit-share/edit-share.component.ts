import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AppHeaderComponent } from "../app-header/app-header.component";

interface ShareParticipant {
  id: number;
  name: string;
  percentage: number;
  amount: number;
  isEditing: boolean;
}

@Component({
  selector: 'app-edit-share-expense',
  standalone: true,
  imports: [CommonModule, FormsModule, AppHeaderComponent],
  templateUrl: './edit-share.component.html',
  styleUrls: ['./edit-share.component.css']
})
export class EditShareExpenseComponent implements OnInit {
  shareExpenseId: string | null = null;
  expenseName: string = '';
  expenseDescription: string = '';
  totalAmount: number = 700000; // Monto total del gasto
  participants: ShareParticipant[] = [
    { id: 1, name: 'Fulanito', percentage: 33.333, amount: 200000, isEditing: false },
    { id: 2, name: 'Juanita', percentage: 33.333, amount: 300000, isEditing: false },
    { id: 3, name: 'Juancho', percentage: 33.333, amount: 200000, isEditing: false }
  ];
  
  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) { }
  
  ngOnInit(): void {
    // Obtener el ID del ShareExpense de la URL
    this.shareExpenseId = this.route.snapshot.paramMap.get('id');
    
    if (this.shareExpenseId) {
      // Aquí se cargarían los datos del ShareExpense desde un servicio
      // usando el ID que viene en la URL
      console.log('Cargando ShareExpense con ID:', this.shareExpenseId);
      
      // Simulación de carga de datos
      this.expenseName = 'Viaje a la playa';
      this.expenseDescription = 'Gastos del viaje a Santa Marta en Semana Santa';
      
      // Los participantes ya están inicializados arriba
    } else {
      // Si no hay ID, redirigir a la página de inicio
      this.router.navigate(['/home']);
    }
  }
  
  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('es-CO', { 
      style: 'currency', 
      currency: 'COP',
      maximumFractionDigits: 0 
    }).format(amount);
  }
  
  formatPercentage(percentage: number): string {
    return percentage.toFixed(3) + '%';
  }
  
  // Iniciar la edición de un porcentaje
  startEditingPercentage(participant: ShareParticipant): void {
    participant.isEditing = true;
  }
  
  // Cancelar la edición de un porcentaje
  cancelEditingPercentage(participant: ShareParticipant): void {
    participant.isEditing = false;
  }
  
  // Guardar el nuevo porcentaje
  savePercentage(participant: ShareParticipant, newPercentageStr: string): void {
    const newPercentage = parseFloat(newPercentageStr);
    
    if (isNaN(newPercentage) || newPercentage <= 0 || newPercentage > 100) {
      alert('Por favor, ingresa un porcentaje válido entre 0 y 100');
      return;
    }
    
    // Guardar el porcentaje anterior para calcular el ajuste
    const oldPercentage = participant.percentage;
    
    // Actualizar el porcentaje del participante
    participant.percentage = newPercentage;
    
    // Calcular el cambio en el porcentaje
    const percentageChange = newPercentage - oldPercentage;
    
    // Ajustar los porcentajes de los demás participantes proporcionalmente
    this.adjustOtherPercentages(participant.id, percentageChange);
    
    // Recalcular los montos basados en los nuevos porcentajes
    this.recalculateAmounts();
    
    // Finalizar la edición
    participant.isEditing = false;
  }
  
  // Ajustar los porcentajes de los demás participantes
  adjustOtherPercentages(excludedParticipantId: number, percentageChange: number): void {
    // Obtener los demás participantes
    const otherParticipants = this.participants.filter(p => p.id !== excludedParticipantId);
    
    // Calcular la suma de porcentajes de los demás participantes
    const sumOtherPercentages = otherParticipants.reduce((sum, p) => sum + p.percentage, 0);
    
    // Si la suma es 0, no podemos ajustar proporcionalmente
    if (sumOtherPercentages <= 0) {
      // Distribuir equitativamente el resto para llegar a 100%
      const remainingPercentage = 100 - this.participants.find(p => p.id === excludedParticipantId)!.percentage;
      const equalShare = remainingPercentage / otherParticipants.length;
      
      otherParticipants.forEach(p => {
        p.percentage = equalShare;
      });
      
      return;
    }
    
    // Ajustar los porcentajes proporcionalmente
    otherParticipants.forEach(p => {
      // Calcular el factor de ajuste basado en la proporción del porcentaje actual
      const adjustmentFactor = p.percentage / sumOtherPercentages;
      
      // Aplicar el ajuste
      p.percentage -= percentageChange * adjustmentFactor;
      
      // Asegurar que el porcentaje no sea negativo
      if (p.percentage < 0) {
        p.percentage = 0;
      }
    });
    
    // Asegurar que la suma total sea exactamente 100%
    this.normalizePercentages();
  }
  
  // Normalizar los porcentajes para que sumen exactamente 100%
  normalizePercentages(): void {
    const totalPercentage = this.participants.reduce((sum, p) => sum + p.percentage, 0);
    
    if (totalPercentage !== 100) {
      // Ajustar proporcionalmente
      const factor = 100 / totalPercentage;
      this.participants.forEach(p => {
        p.percentage = p.percentage * factor;
      });
    }
  }
  
  // Recalcular los montos basados en los porcentajes
  recalculateAmounts(): void {
    this.participants.forEach(p => {
      p.amount = (p.percentage / 100) * this.totalAmount;
    });
  }
  
  saveChanges(): void {
    // Validar que los campos no estén vacíos
    if (!this.expenseName.trim()) {
      alert('Por favor, ingresa un nombre para el ShareExpense');
      return;
    }
    
    // Aquí se implementaría la lógica para guardar los cambios en la base de datos
    console.log('Guardando cambios:', {
      id: this.shareExpenseId,
      name: this.expenseName,
      description: this.expenseDescription,
      participants: this.participants
    });
    
    // Simulación de guardado exitoso
    alert('Cambios guardados con éxito');
    
    // Redirigir al usuario al detalle del ShareExpense
    if (this.shareExpenseId) {
      this.router.navigate(['/share-expense', this.shareExpenseId]);
    } else {
      this.router.navigate(['/home']);
    }
  }
  
  goBack(): void {
    // Redirigir al detalle del ShareExpense o a la página de inicio
    if (this.shareExpenseId) {
      this.router.navigate(['/share-expense', this.shareExpenseId]);
    } else {
      this.router.navigate(['/home']);
    }
  }
  
  logout(): void {
    // Implementar lógica de cierre de sesión
    this.router.navigate(['/login']);
  }
}
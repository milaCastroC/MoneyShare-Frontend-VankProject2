import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-join-share-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './join-share.component.html',
  styleUrls: ['./join-share.component.css']
})
export class JoinShareModalComponent {
  @Output() close = new EventEmitter<void>();
  
  shareCode: string = '';
  isLoading: boolean = false;
  errorMessage: string | null = null;
  
  constructor(private router: Router) { }
  
  closeModal(): void {
    this.close.emit();
  }
  
  joinShare(): void {
    // Validar que el código no esté vacío
    if (!this.shareCode.trim()) {
      this.errorMessage = 'Por favor, ingresa un código válido';
      return;
    }
    
    // Resetear mensaje de error
    this.errorMessage = null;
    
    // Mostrar estado de carga
    this.isLoading = true;
    
    // Aquí se implementaría la lógica para unirse al share usando el código
    // Simulación de una llamada al backend
    setTimeout(() => {
      // Simulación de éxito (en un caso real, esto sería una llamada a un servicio)
      if (this.shareCode === 'FYUBI258135') {
        // Código válido, redirigir al detalle del share
        this.isLoading = false;
        
        // Simulación de ID del share al que se unió
        const shareId = 123;
        
        // Mostrar mensaje de éxito y redirigir
        alert('Te has unido al share exitosamente');
        this.closeModal();
        this.router.navigate(['/share-expense', shareId]);
      } else {
        // Código inválido, mostrar error
        this.isLoading = false;
        this.errorMessage = 'El código ingresado no es válido o ha expirado';
      }
    }, 1500); // Simular un retraso de red
  }
}
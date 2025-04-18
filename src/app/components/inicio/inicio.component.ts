import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { JoinShareModalComponent } from "../join-share/join-share.component";
import { AppHeaderComponent } from "../app-header/app-header.component";

interface ShareAccount {
  id: number;
  title: string;
  subtitle?: string;
  amount: number;
  participants: number;
  color?: string;
}

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [CommonModule, RouterModule, JoinShareModalComponent, AppHeaderComponent],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.css'
})
export class InicioComponent implements OnInit{
  userName: string = 'Fulanito';
  
  shareAccounts: ShareAccount[] = [
    { 
      id: 1, 
      title: 'Viaje Medellín', 
      subtitle: 'Marzo', 
      amount: 150000, 
      participants: 3 
    },
    { 
      id: 2, 
      title: 'Plata de Don Luis', 
      subtitle: 'Marzo', 
      amount: 650000, 
      participants: 2 
    },
    { 
      id: 3, 
      title: 'Viaje de fin de año', 
      subtitle: 'Marzo', 
      amount: 1750000, 
      participants: 3 
    },
    { 
      id: 4, 
      title: 'Viaje Medellín', 
      subtitle: 'Enero', 
      amount: 150000, 
      participants: 3 
    },
    { 
      id: 5, 
      title: 'Plata de Don Luis', 
      subtitle: 'Enero', 
      amount: 650000, 
      participants: 2 
    },
    { 
      id: 6, 
      title: 'Viaje de fin de año', 
      subtitle: 'Enero', 
      amount: 1750000, 
      participants: 3 
    },
    { 
      id: 7, 
      title: 'Viaje Medellín', 
      subtitle: 'Enero', 
      amount: 150000, 
      participants: 3 
    }
  ];

   // Estado para controlar la visibilidad del modal
   showJoinShareModal: boolean = false;

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(amount);
  }

  getParticipantDots(count: number): number[] {
    return Array(count).fill(0);
  }

  createNewShareAccount(): void {
    console.log('Crear nuevo ShareAccount');
    this.router.navigate(['/create-shareexpense']);
  }

  viewShareExpense(id: number): void {
    console.log('Ver detalle del ShareExpense con ID:', id);
    this.router.navigate(['/share-expense', id]);
  }

  joinShareByCode(): void {
    // Mostrar el modal
    this.showJoinShareModal = true;
  }
  
  closeJoinShareModal(): void {
    // Cerrar el modal
    this.showJoinShareModal = false;
  }

  logout(): void {
    console.log('Cerrar sesión');
    this.router.navigate(['/home']);
  }

}

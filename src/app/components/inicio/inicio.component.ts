import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

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
  imports: [CommonModule, RouterModule],
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
    this.router.navigate(['/create-share-expense']);
  }

  joinShareByCode(): void {
    console.log('Unirse a un share por código');
    // Implementar lógica para unirse a un share
  }

  viewReport(): void {
    console.log('Ver informe');
    // Implementar navegación a la página de informes
  }

  viewAll(): void {
    console.log('Ver todo');
    // Implementar navegación a la página de todos los shares
  }

  viewExpenses(): void {
    console.log('Mis gastos');
    // Implementar navegación a la página de gastos
  }

  viewDebts(): void {
    console.log('Mis deudas');
    // Implementar navegación a la página de deudas
  }

  viewGoals(): void {
    console.log('Mis metas');
    // Implementar navegación a la página de metas
  }

  logout(): void {
    console.log('Cerrar sesión');
    // Implementar lógica de cierre de sesión
  }

}

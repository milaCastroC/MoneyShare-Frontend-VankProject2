import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { NotificationButtonComponent } from '../notifications-button/notifications-button.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, NotificationButtonComponent],
  templateUrl: './app-header.component.html',
  styleUrls: ['./app-header.component.css']
})
export class AppHeaderComponent {
  @Input() title: string = '';
  
  constructor(private router: Router) { }
  
  logout(): void {
    // Implementar lógica de cierre de sesión
    localStorage.removeItem('token');
    this.router.navigate(['/']);
  }
}
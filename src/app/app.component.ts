import { Component, signal } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { ChatButtonComponent } from "./components/chat-button/chat-button.component";
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, ChatButtonComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'MoneyShare-Frontend-VankProject2';

  shouldShowChatButton = signal(true);

  constructor(private router: Router) {
    this.router.events
  .pipe(filter(event => event instanceof NavigationEnd))
  .subscribe((event: NavigationEnd) => {
    const currentUrl = event.urlAfterRedirects;
    const hiddenRoutes = ['/', '/login', '/register'];
    
      // Ocultar el chat si la URL actual coincide o inicia con una ruta restringida
      const shouldHide = hiddenRoutes.some(route =>
        currentUrl === route || (route !== '/' && currentUrl.startsWith(route + '/'))
      );
      
      this.shouldShowChatButton.set(!shouldHide);
  });
  }
}

import { Component, type OnInit, type OnDestroy } from "@angular/core"
import { CommonModule } from "@angular/common"
import { Router, NavigationEnd } from "@angular/router"
import { ChatboxComponent } from "../chatbox/chatbox.component"
import { type Subscription, filter } from "rxjs"

@Component({
  selector: "app-chat-button",
  standalone: true,
  imports: [CommonModule, ChatboxComponent],
  templateUrl: "./chat-button.component.html",
  styleUrls: ["./chat-button.component.css"],
})
export class ChatButtonComponent implements OnInit, OnDestroy {
  isChatOpen = false
  isVisible = true
  private routerSubscription: Subscription | undefined

  // Lista de rutas donde el botón NO debe mostrarse
  private excludedRoutes: string[] = ["/", "/login", "/register"]

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Suscribirse a los eventos de navegación para actualizar la visibilidad
    this.routerSubscription = this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.updateVisibility(event.url)
      })

    // Verificar la ruta actual al inicializar
    this.updateVisibility(this.router.url)
  }

  ngOnDestroy(): void {
    // Limpiar la suscripción al destruir el componente
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe()
    }
  }

  updateVisibility(url: string): void {
    // Verificar si la URL actual está en la lista de rutas excluidas
    this.isVisible = !this.excludedRoutes.some(
      (route) => url === route || (route !== "/" && url.startsWith(route + "/")),
    )
  }

  toggleChat(): void {
    this.isChatOpen = !this.isChatOpen
  }

  closeChat(): void {
    this.isChatOpen = false
  }
}
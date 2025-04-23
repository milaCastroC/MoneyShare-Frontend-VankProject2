import { Component, EventEmitter, Output } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"

interface ChatMessage {
  content: string
  isUser: boolean
  timestamp: Date
}

@Component({
  selector: "app-chatbox",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./chatbox.component.html",
  styleUrls: ["./chatbox.component.css"],
})
export class ChatboxComponent {
  @Output() close = new EventEmitter<void>()

  messages: ChatMessage[] = []
  newMessage = ""
  isLoading = false

  constructor() {
    // Mensaje de bienvenida al iniciar el chat
    this.addBotMessage("¡Hola! Soy el asistente de MoneyShare. ¿En qué puedo ayudarte hoy?")
  }

  closeChat(): void {
    this.close.emit()
  }

  sendMessage(): void {
    if (!this.newMessage.trim()) return

    // Añadir mensaje del usuario
    this.addUserMessage(this.newMessage)

    const userMessage = this.newMessage
    this.newMessage = "" // Limpiar el input

    // Simular respuesta del bot
    this.isLoading = true
    setTimeout(() => {
      this.respondToMessage(userMessage)
      this.isLoading = false
    }, 1000)
  }

  addUserMessage(content: string): void {
    this.messages.push({
      content,
      isUser: true,
      timestamp: new Date(),
    })
  }

  addBotMessage(content: string): void {
    this.messages.push({
      content,
      isUser: false,
      timestamp: new Date(),
    })
  }

  respondToMessage(message: string): void {
    const lowerCaseMessage = message.toLowerCase()

    if (lowerCaseMessage.includes("hola") || lowerCaseMessage.includes("saludos")) {
      this.addBotMessage("¡Hola! ¿En qué puedo ayudarte con MoneyShare?")
    } else if (lowerCaseMessage.includes("crear") && lowerCaseMessage.includes("gasto")) {
      this.addBotMessage(
        'Para crear un nuevo gasto, puedes hacer clic en el botón "Crear nuevo ShareAccount" en la página de inicio.',
      )
    } else if (lowerCaseMessage.includes("unir") && lowerCaseMessage.includes("código")) {
      this.addBotMessage(
        'Para unirte a un share con código, haz clic en "Unirse a un share por código" en la página de inicio y luego ingresa el código que te proporcionaron.',
      )
    } else if (lowerCaseMessage.includes("pagar") || lowerCaseMessage.includes("deuda")) {
      this.addBotMessage(
        'Para pagar una deuda, ve al detalle del ShareExpense, selecciona la pestaña "balance" y haz clic en el botón "Pagar".',
      )
    } else if (lowerCaseMessage.includes("gracias")) {
      this.addBotMessage("¡De nada! Estoy aquí para ayudarte. ¿Hay algo más en lo que pueda asistirte?")
    } else {
      this.addBotMessage(
        "Lo siento, no entiendo completamente tu pregunta. ¿Podrías reformularla o ser más específico sobre lo que necesitas ayuda con MoneyShare?",
      )
    }
  }
}

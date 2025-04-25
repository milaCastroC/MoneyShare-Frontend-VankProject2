import { Component, EventEmitter, Output, ViewChild, ElementRef, AfterViewChecked } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"
import { AiService } from "../../services/ai.service"

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
export class ChatboxComponent implements AfterViewChecked {
  @Output() close = new EventEmitter<void>()
  @ViewChild('messagesContainer') private messagesContainer!: ElementRef;
  @ViewChild('messageElement') private lastMessage!: ElementRef;

  messages: ChatMessage[] = []
  newMessage = ""
  isLoading = false

  constructor(private aiService: AiService) {
    // Mensaje de bienvenida al iniciar el chat
    this.addBotMessage("¡Hola! Soy el asistente de MoneyShare. ¿En qué puedo ayudarte hoy?")
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  private scrollToBottom(): void {
    try {
      this.messagesContainer.nativeElement.scrollTop = this.messagesContainer.nativeElement.scrollHeight;
    } catch(err) {
      console.error('Error al hacer scroll:', err);
    }
  }

  closeChat(): void {
    this.close.emit()
  }

  sendMessage(): void {
    if (!this.newMessage.trim()) return

    this.addUserMessage(this.newMessage)

    const userMessage = this.newMessage;
    
    this.isLoading = true;
    this.aiService.sendMessage(this.newMessage)
    .then((response: any) => {
      this.addBotMessage(response.message);
      console.log('respuesta del bot:', response);
    })
    .catch(error => {
      console.error('Error al enviar el mensaje:', error);
    })
    .finally(() => {
      this.isLoading = false
    });
    this.newMessage = "" // Limpiar el input

  }

  addUserMessage(content: string): void {
    this.messages.push({
      content,
      isUser: true,
      timestamp: new Date(),
    });
    this.scrollToBottom();
  }

  addBotMessage(content: string): void {
    this.messages.push({
      content,
      isUser: false,
      timestamp: new Date(),
    });
    this.scrollToBottom();
  }

}

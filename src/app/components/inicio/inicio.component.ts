import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { JoinShareModalComponent } from "../join-share/join-share.component";
import { AppHeaderComponent } from "../app-header/app-header.component";
import { ShareService } from '../../services/share.service';
import { Share } from '../../models/share.model';
import { ShareSplitService } from '../../services/share-split.service';
import { UsuarioService } from '../../services/usuario.service';
import { AiService } from '../../services/ai.service';

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
export class InicioComponent implements OnInit {
  userName: string = '';

  shareAccounts: ShareAccount[] = [];

  // Estado para controlar la visibilidad del modal
  showJoinShareModal: boolean = false;

  constructor(private router: Router,
    private shareService: ShareService,
    private shareSplitService: ShareSplitService,
    private aiService: AiService,
    private usuarioService: UsuarioService
  ) { }

  ngOnInit(): void {
    this.loadUserShares();
    this.loadUserData();
    this.aiService.deleteHistory();
  }

  async loadUserShares(): Promise<void> {
    try {
      const response: any = await this.shareService.fetchUserShares();
      const shares = response.data;

      const shareAccounts = await Promise.all(
        shares.map(async (share: any) => {
          const participants: any = await this.shareSplitService.countMemberByShare(share.id_share);

          if (share.type == 'share_expense') {
            return {
              id: share.id_share,
              title: share.name,
              subtitle: share.description,
              amount: share.paid_amount,
              participants: participants.data
            } as ShareAccount;
          }

          return {
            id: share.id_share,
            title: share.name,
            subtitle: share.description,
            amount: share.amount,
            participants: participants.data
          } as ShareAccount;
        })
      );

      this.shareAccounts = shareAccounts;

    } catch (error) {
      console.error('Error loading shares:', error);
    }
  }

  truncateDescription(text: string, maxWords: number): string {
    const words = text.split(' ');
    if (words.length > maxWords) {
      return words.slice(0, maxWords).join(' ') + '...';
    }
    return text;
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


  // Método para cargar datos del usuario
  loadUserData(): void {
    try {
      // Obtenemos la información del token
      const tokenInfo = this.usuarioService.getTokenInfo();

      if (tokenInfo.isAuthenticated && tokenInfo.email) {
        // Si tenemos el email, intentamos obtener más datos del usuario
        this.usuarioService.getUsuarioByEmail(tokenInfo.email)
          .then((response: any) => {
            if (response && response.data) {
              // Asumiendo que la respuesta tiene un campo name o un campo similar
              this.userName = response.data.name || response.data.username ||
                (tokenInfo.email ? tokenInfo.email.split('@')[0] : 'Usuario');
            } else {
              // Si no hay datos específicos, usamos el email como nombre de usuario
              this.userName = (tokenInfo.email ?? '').split('@')[0];
            }
          })
          .catch(error => {
            console.error('Error al obtener datos del usuario:', error);
            // Usamos el email como alternativa si falla la petición
            this.userName = (tokenInfo.email ?? '').split('@')[0];
          });
      }
    } catch (error) {
      console.error('Error cargando datos del usuario:', error);
    }
  }
}

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { JoinShareModalComponent } from "../join-share/join-share.component";
import { AppHeaderComponent } from "../app-header/app-header.component";
import { ShareService } from '../../services/share.service';
import { Share } from '../../models/share.model';
import { ShareSplitService } from '../../services/share-split.service';

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
  userName: string = 'Fulanito';

  shareAccounts: ShareAccount[] = [];

  // Estado para controlar la visibilidad del modal
  showJoinShareModal: boolean = false;

  constructor(private router: Router, private shareService: ShareService, private shareSplitService: ShareSplitService) { }

  ngOnInit(): void {
    this.loadUserShares();
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

}

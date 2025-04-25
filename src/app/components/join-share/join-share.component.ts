import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ShareService } from '../../services/share.service';
import { Share } from '../../models/share.model';

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
  
  constructor(private router: Router, private shareService: ShareService) { }
  
  closeModal(): void {
    this.close.emit();
  }

  reloadCurrentRoute() {
    const currentUrl = this.router.url;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([currentUrl]);
    });
  }
  
  joinShare(): void {
    // Validar que el código no esté vacío
    if (!this.shareCode.trim()) {
      this.errorMessage = 'Por favor, ingresa un código válido';
      return;
    }
    
    this.errorMessage = null;
    this.isLoading = true;

    this.shareService.joinShare({code: this.shareCode})
    .then((response: any) => {
      alert('Te has unido al share exitosamente');
      const idShare = response.data.id_share;
      
      this.closeModal();
      
      //this.reloadCurrentRoute();
      this.router.navigate(['/share-expense', idShare]);
    })
    .catch(error => {
      console.error('Error en login:', error);
      this.errorMessage = error.response.data.message;
    })
    .finally(() => {
      this.isLoading = false;
    });
    
  }
}
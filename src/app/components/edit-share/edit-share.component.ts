import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AppHeaderComponent } from "../app-header/app-header.component";
import { ShareMember } from '../../models/share-member.model';
import { ShareService } from '../../services/share.service';
import { UsuarioService } from '../../services/usuario.service';
import { ToastrService } from 'ngx-toastr';

interface ShareParticipant extends ShareMember {
  isEditing: boolean;
}

@Component({
  selector: 'app-edit-share-expense',
  standalone: true,
  imports: [CommonModule, FormsModule, AppHeaderComponent],
  templateUrl: './edit-share.component.html',
  styleUrls: ['./edit-share.component.css']
})
export class EditShareExpenseComponent implements OnInit {
  shareExpenseId: string | null = null;
  shareName: string = '';
  shareDescription: string = '';
  totalAmount: number = 0;
  participants: ShareParticipant[] = [];
  percentageChange: boolean = false;
  isAdmin: boolean = false;
  editModeAvailable: boolean = false;

  constructor(
    private router: Router,
    private shareService: ShareService,
    private usuarioService: UsuarioService,
    private route: ActivatedRoute,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    // Obtener el ID del ShareExpense de la URL
    this.shareExpenseId = this.route.snapshot.paramMap.get('id');

    if (this.shareExpenseId) {
      this.getShareData(this.shareExpenseId);
      this.getShareMembers(this.shareExpenseId);
    } else {
      this.router.navigate(['/home']);
    }
  }

  
  disableEditMode(adminId: number) {
    const userEmail = this.usuarioService.getTokenInfo().email;
    if (userEmail) {
      this.usuarioService.getUsuarioByEmail(userEmail)
        .then((res: any) => {
          if (res.data.id_user === adminId) {
            this.editModeAvailable = true;
          } else {
            this.editModeAvailable = false;
          }
        });
    } 
  
  }

  getShareData(id: string) {
    this.shareService.findShareById(id)
      .then((res: any) => {
        this.totalAmount = res.data.paid_amount;
        this.shareName = res.data.name;
        this.shareDescription = res.data.description;
        this.disableEditMode(res.data.id_creator);
      })
      .catch((err: any) => {
        console.error('Error al obtener los datos del ShareExpense:', err);
      });
  }

  getShareMembers(id: string) {
    this.shareService.findShareMemebers(parseInt(id))
      .then((res: any) => {
        res.data.map((member: ShareMember) => {
          this.participants.push({
            ...member,
            isEditing: false
          });
        });
      })
      .catch((err: any) => {
        console.error('Error al obtener los participantes del ShareExpense:', err);
      });
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0
    }).format(amount);
  }

  formatPercentage(percentage: any): string {
    const value = Number(percentage);
    if (isNaN(value)) return '0.00%';
    return value.toFixed(2) + '%';
  }

  // Iniciar la edición de un porcentaje
  startEditingPercentage(participant: ShareParticipant): void {
    participant.isEditing = true;
  }

  // Cancelar la edición de un porcentaje
  cancelEditingPercentage(participant: ShareParticipant): void {
    participant.isEditing = false;
  }

  validatePercentageChange(): void {
    this.shareService.findShareMemebers(parseInt(this.shareExpenseId!))
      .then((res: any) => {
        res.data.forEach((member: ShareMember) => {
          const oldPercentage = this.participants.find(p => p.id_user === member.id_user)?.percentage;
          if (member.percentage != oldPercentage) {
            this.percentageChange = true;
          }
        });
      })
      .catch((err: any) => {
        console.error('Error al obtener los participantes del ShareExpense:', err);
      });
  }

  validateNewPercentages(newPercentages: any[]): boolean {
    const total = newPercentages.reduce((acc: number, curr: any) => acc + Number(curr.percentage), 0);

    const margin = 0.01;

    if (Math.abs(total - 100) > margin) {
      this.showError(`La suma de los porcentajes debe ser exactamente 100%. Actualmente suma ${total.toFixed(2)}%`);
      return false;
    }
    return true;
  }

  // Guardar el nuevo porcentaje
  savePercentage(participant: ShareParticipant, newPercentageStr: string): void {
    const newPercentage = parseFloat(newPercentageStr);

    if (isNaN(newPercentage) || newPercentage <= 0 || newPercentage > 100) {
      this.showError('Porcentajes no valido. Por favor, ingresa un porcentaje válido entre 0 y 100');
      return;
    }
    participant.percentage = newPercentage;
    this.recalculateAmount(participant);
    // Finalizar la edición
    participant.isEditing = false;

  }

  recalculateAmount(participant: ShareParticipant) {
    const newAmount = (participant.percentage / 100) * this.totalAmount;
    participant.amount_to_pay = newAmount;
  };

  updatePercentages(): boolean {
    let newPercentages: any[] = [];
    this.participants.forEach((participant: ShareParticipant) => {
      let userData = {
        id_user: participant.id_user,
        percentage: participant.percentage
      }
      newPercentages.push(userData);
    });
    
    const isValid = this.validateNewPercentages(newPercentages);
    if (isValid) {
      this.shareService.modifyPercentages(Number(this.shareExpenseId), newPercentages);
      return true;
    }
    return false;
    
  }

  updateShareData() {
    this.shareService.updateShare({
      id_share: Number(this.shareExpenseId),
      name: this.shareName,
      description: this.shareDescription
    })
      .then((res: any) => {
      })
      .catch((err: any) => {
        console.error('Error al guardar los cambios del ShareExpense:', err);
      });
  }

  saveChanges(): void {
    if (!this.shareName.trim()) {
      this.showInfo('Por favor, ingresa un nombre para el ShareExpense');
      return;
    }

    this.updateShareData();
    const isValid = this.updatePercentages();
    if (!isValid) {
      return;
    }

    this.showSuccess('Cambios guardados con éxito');
    this.percentageChange = false;
    if (this.shareExpenseId) {
      this.router.navigate(['/share-expense', this.shareExpenseId]);
    } else {
      this.router.navigate(['/home']);
    }
  }

  goBack(): void {
    // Redirigir al detalle del ShareExpense o a la página de inicio
    if (this.shareExpenseId) {
      this.router.navigate(['/share-expense', this.shareExpenseId]);
    } else {
      this.router.navigate(['/home']);
    }
  }

  logout(): void {
    // Implementar lógica de cierre de sesión
    this.router.navigate(['/login']);
  }

  showError(message: string): void {
    this.toastr.error(message);
  }

  showSuccess(message: string): void {
    this.toastr.success(message);
  }

  showInfo(message: string): void {
    this.toastr.info(message);
  }
}
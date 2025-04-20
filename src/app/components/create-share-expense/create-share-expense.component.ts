import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AppHeaderComponent } from "../app-header/app-header.component";
import { ShareService } from '../../services/share.service';

interface ShareExpenseData {
  type: string;
  name: string;
  status: string;
  description?: string;
  due_date?: string;
  split_equally: true;
}

import { AbstractControl, ValidationErrors } from '@angular/forms';

function dateFormatValidator(control: AbstractControl): ValidationErrors | null {
  const value = control.value;
  if (!value) return null; // Es opcional

  // Validación simple de formato YYYY-MM-DD
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  return dateRegex.test(value) ? null : { invalidDateFormat: true };
}


@Component({
  selector: 'app-create-share-expense',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, AppHeaderComponent],
  templateUrl: './create-share-expense.component.html',
  styleUrl: './create-share-expense.component.css'
})
export class CreateShareExpenseComponent implements OnInit{
  shareExpenseForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private shareService: ShareService,
    private router: Router
  ) {
    this.shareExpenseForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      deadline: [''],
      description: ['']
    });
  }

  ngOnInit(): void {
    this.shareExpenseForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      deadline: ['', [dateFormatValidator]],
      description: ['']
    });
  }

  onSubmit(): void {
    if (this.shareExpenseForm.valid) {

      console.log('Formulario enviado:', this.shareExpenseForm.value);
      const shareExpense: ShareExpenseData = {
        type: "share_expense",
        name: this.shareExpenseForm.value.name,
        status: "active",
        split_equally: true,
        due_date: this.shareExpenseForm.value.deadline || undefined,
        description: this.shareExpenseForm.value.description || ''
      };

      this.shareService.createShare(shareExpense)
      .then((response: any) => {
        console.log('registro exitoso:', response);
        this.router.navigate(['/inicio']); // TODO: Redirigir al que acabó de crear
      })
      .catch(error => {
        console.error('Error creando el share:', error);
      });
      

    } else {
      // Marcar todos los campos como tocados para mostrar errores
      Object.keys(this.shareExpenseForm.controls).forEach(key => {
        const control = this.shareExpenseForm.get(key);
        control?.markAsTouched();
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/inicio']);
  }

  logout(): void {
    // Implementar lógica de cierre de sesión
    this.router.navigate(['/login']);
  }
}

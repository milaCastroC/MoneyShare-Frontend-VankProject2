import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AppHeaderComponent } from "../app-header/app-header.component";

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
    private router: Router
  ) {
    this.shareExpenseForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      deadline: [''],
      description: ['']
    });
  }

  ngOnInit(): void {
  }

  onSubmit(): void {
    if (this.shareExpenseForm.valid) {
      // Aquí se enviaría la información a un servicio
      console.log('Formulario enviado:', this.shareExpenseForm.value);
      
      // Redirigir al dashboard de inicio
      this.router.navigate(['/home']);
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

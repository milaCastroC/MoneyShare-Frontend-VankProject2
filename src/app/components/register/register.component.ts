// register.component.ts
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']

})

export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  submitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      nombre: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50)
      ]],
      usuario: ['', [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(20),
        Validators.pattern('^[a-zA-Z0-9._-]*$')
      ]],
      contrasena: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d]{8,}$')
      ]],
      correo: ['', [
        Validators.required,
        Validators.email,
        Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$')
      ]],
      telefono: ['', [
        Validators.required,
        Validators.pattern('^[0-9]{10}$')
      ]]
    });
  }

  // Getter para facilitar el acceso a los campos del formulario
  get f() {
    return this.registerForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;

    // Detener si el formulario es inválido
    if (this.registerForm.invalid) {
      return;
    }

    // Aquí iría la lógica para enviar los datos al servicio de registro
    console.log('Datos de registro:', this.registerForm.value);
    
    // Navegación después de registro exitoso
    // this.router.navigate(['/login']);
  }
}
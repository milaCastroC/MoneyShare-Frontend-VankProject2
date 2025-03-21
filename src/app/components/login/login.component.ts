import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'] 
})

export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  submitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', [
        Validators.required, 
        Validators.email,
        Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$')
      ]],
      password: ['', [
        Validators.required,
        Validators.minLength(8)
      ]]
    });
  }

  // Getter para acceder fácilmente a los campos del formulario
  get f() { 
    return this.loginForm.controls; 
  }

  onSubmit(): void {
    this.submitted = true;

    // Detener si el formulario es inválido
    if (this.loginForm.invalid) {
      return;
    }

    // Aquí iría la lógica para enviar los datos al servicio de autenticación
    console.log('Datos de inicio de sesión:', this.loginForm.value);
  }
}

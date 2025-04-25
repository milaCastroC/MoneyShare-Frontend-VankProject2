import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.css']
})
export class NotFoundComponent {
  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  goToHome(): void {
    if(localStorage.getItem('token')){
      this.router.navigate(['/inicio']);
    }else{
      this.router.navigate(['/']);
    }
  }

}
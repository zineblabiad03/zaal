import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-connexion',
  templateUrl: './connexion.component.html',
  styleUrl: './connexion.component.css'
})
export class AuthComponent {
  email = '';
  motDePasse = '';
  messageErreur = '';

  constructor(private authService: AuthService, private router: Router) {}
  
  async connecter() {
    const success = await this.authService.signIn(this.email, this.motDePasse);
    if (success) {
        this.router.navigate(['/search-flight']);
    } else {
        console.error('Failed');
    }
  }
}

import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css'
})
export class AuthComponent {
  email = '';
  password = '';

  constructor(private authService: AuthService, private router: Router) {}

  async signUp() {
    const success = await this.authService.signUp(this.email, this.password);
    if (success) {
      console.log('Inscription réalisée avec succès.');
      this.router.navigate(['/sign-in']);
    } else {
      console.error("Erreur lors de l'inscription.");
    }
  }

  async signIn() {
    const success = await this.authService.signIn(this.email, this.password);
    if (success) {
      console.log('Connexion réalisée avec succès.');
      this.router.navigate(['/search-flight']);
    } else {
      console.error("Erreur lors de la connexion.");
    }
  }

  async signOut() {
    const success = await this.authService.signOut();
    if (success) {
      console.log('Déconnexion réalisée avec succès.');
    } else {
        console.error('Failed');
    }
  }

}

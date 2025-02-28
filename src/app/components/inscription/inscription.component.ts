import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-inscription',
  templateUrl: './inscription.component.html',
  styleUrl: './inscription.component.css'
})
export class InscriptionComponent {
  email = '';
  motDePasse = '';
  confirmerMotDePasse = '';
  messageErreur = '';

  constructor(private authService: AuthService, private router: Router) {}
  
  async inscrire() {

    if (this.motDePasse !== this.confirmerMotDePasse) {
      this.messageErreur = "Les mots de passe ne correspondent pas.";
      return;
    }

    if (!this.emailValide(this.email)) {
      this.messageErreur = "L'email ne respecte pas les critères.";
      return;
    }

    if (!this.motDePasseValide(this.motDePasse)) {
      this.messageErreur = "Le mot de passe doit contenir au moins 6 caractères, une lettre majuscule, une lettre minuscule et un chiffre.";
      return;
    }

    const success = await this.authService.signUp(this.email, this.motDePasse);
    if (success) {
      await this.authService.signOut();
      this.router.navigate(['/sign-in'], {queryParams: { compteCree: 'true'}});
    } else {
      console.error('Failed to sign up.');
    }
  }
  emailValide(email: string): boolean {
    return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
  }

  motDePasseValide(motDePasse: string): boolean {
    return motDePasse.length >= 6;
  }


}

import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-connexion',
  templateUrl: './connexion.component.html',
  styleUrl: './connexion.component.css'
})
export class ConnexionComponent {
  email = '';
  motDePasse = '';
  
  messageErreur = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  async connecter() {

    const success = await this.authService.signIn(this.email, this.motDePasse);

    if (success) {
      this.messageErreur = '';
      this.router.navigate(['/search-flight']);
      console.log('Connexion réalisée avec succès.');
    } else {
      this.messageErreur = 'Email ou mot de passe invalide.';
      console.error("Erreur lors de la connexion.");
    }
  }

}

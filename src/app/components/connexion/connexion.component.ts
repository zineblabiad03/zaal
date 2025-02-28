import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-connexion',
  templateUrl: './connexion.component.html',
  styleUrl: './connexion.component.css'
})
export class ConnexionComponent implements OnInit {
  email = '';
  motDePasse = '';
  messageErreur = '';
  messageSucces = '';

  constructor(private authService: AuthService, private router: Router, private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if(params['compteCree'] == 'true'){
        this.messageSucces = "Compte crée avec succès. Vérifier votre boîte mail !";
      }
    })
  }

  async connecter() {
    const success = await this.authService.signIn(this.email, this.motDePasse);
    if (success) {
      this.router.navigate(['/search-flight']);
    } else {
        console.error('Failed to sign in.');
    }
  }
}

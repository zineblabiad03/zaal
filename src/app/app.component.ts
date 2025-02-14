import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'zaal';

  constructor(public authService: AuthService, private router: Router) {}

  async logout() {
    const success = await this.authService.signOut();
    if (success) {
      this.router.navigate(['/login']);
    }
  }


  ngOnInit() {
  }
}

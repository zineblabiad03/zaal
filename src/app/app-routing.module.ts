import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { redirectUnauthorizedTo, redirectLoggedInTo, canActivate } from '@angular/fire/auth-guard';
import { AppComponent } from './app.component';
import { ConnexionComponent } from './components/connexion/connexion.component';
import { InscriptionComponent } from './components/inscription/inscription.component';
import { FlightSearchComponent } from './components/flight-search/flight-search.component';

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['sign-in']);
const redirectLoggedInToItems = () => redirectLoggedInTo(['search-flight']);

const routes: Routes = [
  { 
    path: 'sign-in',
    component: ConnexionComponent,
    ...canActivate(redirectLoggedInToItems)
  },
  { 
    path: 'sign-up',
    component: InscriptionComponent
  },
  { 
    path: 'search-flight',
    component: FlightSearchComponent,
    ...canActivate(redirectUnauthorizedToLogin)
  },
  { path: '', redirectTo: 'sign-in', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

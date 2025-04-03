import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { redirectUnauthorizedTo, redirectLoggedInTo, canActivate } from '@angular/fire/auth-guard';
import { AppComponent } from './app.component';
import { ConnexionComponent } from './components/connexion/connexion.component';
import { InscriptionComponent } from './components/inscription/inscription.component';
import { ListeAeroportComponent } from './components/liste-aeroport/liste-aeroport.component';
import { SavedFlightsComponent } from './components/saved-flights/saved-flights.component';

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
    component: ListeAeroportComponent,
    ...canActivate(redirectUnauthorizedToLogin)
  },
  { path: 'saved-flights',
    component: SavedFlightsComponent,
    ...canActivate(redirectUnauthorizedToLogin)
  },
  { path: '**', redirectTo: 'sign-in', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { redirectUnauthorizedTo, redirectLoggedInTo, canActivate } from '@angular/fire/auth-guard';
import { AppComponent } from './app.component';
import { AuthComponent } from './components/auth/auth.component';
import { FlightSearchComponent } from './components/flight-search/flight-search.component';

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['login']);
const redirectLoggedInToItems = () => redirectLoggedInTo(['search-flight']);

const routes: Routes = [
  { 
    path: 'login',
    component: AuthComponent,
    ...canActivate(redirectLoggedInToItems)
  },
  { 
    path: 'search-flight',
    component: FlightSearchComponent,
    ...canActivate(redirectUnauthorizedToLogin)
  },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

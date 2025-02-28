import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import {MatFormFieldModule} from '@angular/material/form-field';


import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { FlightSearchComponent } from './components/flight-search/flight-search.component';

import {MatIcon, MatIconModule} from '@angular/material/icon';

import { FormsModule } from '@angular/forms';
import { AuthComponent } from './components/auth/auth.component';

import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { VolsComponent } from './components/vols/vols.component';
import { InscriptionComponent } from './components/inscription/inscription.component';
import { ConnexionComponent } from './components/connexion/connexion.component';

@NgModule({
  declarations: [
    AppComponent,
    FlightSearchComponent,
    AuthComponent,
    VolsComponent,
    InscriptionComponent,
    ConnexionComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    MatFormFieldModule,
    MatIcon,
    provideFirebaseApp(() => initializeApp({
      "projectId":"zaal-d2b99",
      "appId":"1:517938653680:web:854cd14199e6a9d814d535",
      "storageBucket":"zaal-d2b99.firebasestorage.app",
      "apiKey":"AIzaSyAOesZDJdieu-fKxDpDe2bn4ydWKX4rn9M",
      "authDomain":"zaal-d2b99.firebaseapp.com",
      "messagingSenderId":"517938653680",
      "measurementId":"G-YZBMCEL0C5"})),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore())
  ],
  providers: [
    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendEmailVerification, signOut, onAuthStateChanged } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticated: boolean = false;
  private authInitialized: boolean = false;

  constructor(private auth: Auth) {
    onAuthStateChanged(this.auth, (user) => {
      this.isAuthenticated = !!user;
      this.authInitialized = true;
    });
  }

  async signUp(email: string, password: string): Promise<boolean> { 
    // return createUserWithEmailAndPassword(this.auth, email, password).then(utilisateur => {
    //   console.log(utilisateur);
    //   sendEmailVerification(utilisateur.user).then(emailverif => {
    //     console.log(emailverif);
    //   });
    //   console.log('Success');
    // });
    try {
      const utilisateur = await createUserWithEmailAndPassword(this.auth, email, password);
      await sendEmailVerification(utilisateur.user);
      console.log('Success');
      return true;
    } catch (error: any) {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log('Failed:', errorCode, errorMessage);
      return false;
    }
  }

  async signIn(email: string, password: string): Promise<boolean> {
    try {
      const utilisateur = await signInWithEmailAndPassword(this.auth, email, password);
      if (!utilisateur.user.emailVerified) {
        await signOut(this.auth);
        console.log("Echec de verification d'email");
        return false;
      }
      console.log('Success');
      return true;
    } catch (error: any) {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log('Failed:', errorCode, errorMessage);
      return false;
    }
  }

  async signOut(): Promise<boolean> {
    try {
      await signOut(this.auth);
      return true;
    } catch (error) {
      console.error('Sign Out Error:', error);
      return false;
    }
  }


  getIsAuthenticated(): boolean {
    return this.isAuthenticated;
  }

  getIsAuthInitialized(): boolean {
    return this.authInitialized;
  }

}

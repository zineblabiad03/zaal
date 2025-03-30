import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendEmailVerification, signOut, onAuthStateChanged, User } from '@angular/fire/auth';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticated: boolean = false;
  private authInitialized: boolean = false;
  private user = new BehaviorSubject<User | null>(null);

  constructor(private auth: Auth) {
    onAuthStateChanged(this.auth, (user) => {
      this.isAuthenticated = !!user;
      this.authInitialized = true;
      this.user.next(user);
    });
  }

  async signUp(email: string, password: string): Promise<boolean> {
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

  getUser(): Observable<User | null> {
    return this.user.asObservable();
  }

  getUserId(): string {
    return this.user.value ? this.user.value.uid : '';
  }

  getIsAuthenticated(): boolean {
    return this.isAuthenticated;
  }

  getIsAuthInitialized(): boolean {
    return this.authInitialized;
  }

}

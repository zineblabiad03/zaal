import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, setDoc, deleteDoc, getDocs, getDoc, doc } from '@angular/fire/firestore';


@Injectable({
  providedIn: 'root'
})
export class FirestoreService {
  constructor(private firestore : Firestore) { }
  async ajouterVol(vol: any) : Promise<void> {
    const volsCollection = collection(this.firestore, 'vols');
    await addDoc(volsCollection, vol);
  }
  async getVols(): Promise<any[]> {
    const volsCollection = collection(this.firestore, 'vols');
    const querySnapshot = await getDocs(volsCollection);
    
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }
  async getVolById(id: string): Promise<any | null> {
    const docRef = doc(this.firestore, `vols/${id}`);
    const docSnap = await getDoc(docRef);

    return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
  }
  async deleteVol(id: string): Promise<void> {
    const docRef = doc(this.firestore, `vols/${id}`);
    await deleteDoc(docRef);
  }
}

  

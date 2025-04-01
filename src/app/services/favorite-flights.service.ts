import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, query, where, getDocs, deleteDoc, doc } from '@angular/fire/firestore';
import { FlightOffer } from '../models/flight.model';
import { Observable } from 'rxjs';
import { collectionData } from 'rxfire/firestore';

@Injectable({
  providedIn: 'root'
})
export class FavoriteFlightsService {
  private collectionName = 'favoriteFlights';

  constructor(private firestore: Firestore) {}

  async saveFlight(flight: FlightOffer, userId: string) {
    const flightCollection = collection(this.firestore, this.collectionName);
    return await addDoc(flightCollection, {
      userId,
      flightId: flight.id,
      itineraries: flight.itineraries,
      price: flight.price
    });
  }

  getUserFavorites(userId: string): Observable<any[]> {
    const flightCollection = collection(this.firestore, this.collectionName);
    const q = query(flightCollection, where('userId', '==', userId));
    return collectionData(q, { idField: 'id' });
  }

  async removeFlight(docId: string) {
    try {
      console.log(docId);
      const flightDocRef = doc(this.firestore, `${this.collectionName}/${docId}`);
      await deleteDoc(flightDocRef);

      console.log('Successful deletion.');
      //console.log(`Deleted ${querySnapshot.size} flights where ${fieldName} = ${value}`);
    } catch (error) {
      console.error('Error deleting flights:', error);
    }
  }
}

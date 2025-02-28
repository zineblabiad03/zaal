import { Component, OnInit } from '@angular/core';
import { FirestoreService } from '../../services/firestore.service'; 

@Component({
  selector: 'app-vols',
  templateUrl: './vols.component.html',
  styleUrls: ['./vols.component.css']
})
export class VolsComponent implements OnInit {
  vols: any[] = [];

  // 🔹 Injection du service dans le constructeur
  constructor(private firestoreService: FirestoreService) {}

  // 🔹 Lire les vols au chargement du composant
  async ngOnInit() {
    await this.chargerVols();
  }

  // 🔹 Fonction pour récupérer les vols
  async chargerVols() {
    this.vols = await this.firestoreService.getVols(); // ✅ Le service est utilisé ici
  }

  // 🔹 Ajouter un vol
  async ajouterVol() {
    const vol = {
      compagnie: "Air France",
      depart: "Paris",
      arrivee: "New York",
      prix: 450
    };

    await this.firestoreService.ajouterVol(vol); // ✅ Utilisation du service
    await this.chargerVols(); // Mettre à jour la liste
  }

  // 🔹 Supprimer un vol
  async supprimerVol(id: string) {
    await this.firestoreService.deleteVol(id); // ✅ Utilisation du service
    await this.chargerVols(); // Mettre à jour la liste
  }
}

import { firestore } from "../firebase";
import { collection, getDocs, doc, setDoc, updateDoc, deleteDoc, query, where } from "firebase/firestore";

class Livre {
  // Attributs essentiels pour définir un livre
  constructor(id, name, price, genre, hauteur, coverUrl, dateAdded, episodes, is_serie, nbr_lecture, nbr_user_note, nbr_vues, note, pdfUrl, revues, small_summary, summary, verdict) {
    this.id = id;  // ID unique du livre
    this.name = name;  // Nom du livre
    this.price = price;  // Prix du livre
    this.genre = genre;  // Genre du livre
    this.hauteur = hauteur;  // Auteur du livre
    this.coverUrl = coverUrl;  // URL de la couverture du livre
    this.dateAdded = dateAdded;  // Date d'ajout du livre
    this.episodes = episodes;  // Liste des épisodes si applicable
    this.is_serie = is_serie;  // Indique si c'est une série
    this.nbr_lecture = nbr_lecture;  // Nombre de lectures
    this.nbr_user_note = nbr_user_note;  // Nombre de notes des utilisateurs
    this.nbr_vues = nbr_vues;  // Nombre de vues
    this.note = note;  // Note moyenne du livre
    this.pdfUrl = pdfUrl;  // URL du PDF du livre
    this.revues = revues;  // Avis des utilisateurs sur le livre
    this.small_summary = small_summary;  // Résumé court du livre
    this.summary = summary;  // Résumé complet du livre
    this.verdict = verdict;  // Verdict de validation du livre
  }

  // Méthode pour obtenir tous les livres d'un auteur
  static async getLivresByAuteur(auteurId) {
    try {
      const livresRef = collection(firestore, "livres");
      const q = query(livresRef, where("hauteur", "==", auteurId));
      const querySnapshot = await getDocs(q);
      
      const livres = [];
      querySnapshot.forEach((doc) => {
        livres.push(doc.data());
      });

      return livres;
    } catch (error) {
      console.error("Erreur lors de la récupération des livres de l'auteur :", error);
      return [];
    }
  }

  // Méthode pour créer un nouveau livre
  static async createLivre(auteurId, livreData) {
    try {
      const livresRef = collection(firestore, "livres");
      const newLivreRef = doc(livresRef, livreData.id);
      await setDoc(newLivreRef, {
        ...livreData,
        hauteur: auteurId,  // Associe le livre à l'auteur via l'ID
        dateAdded: new Date().toISOString(),
      });

      return "Livre créé avec succès";
    } catch (error) {
      console.error("Erreur lors de la création du livre :", error);
      return "Erreur lors de la création du livre";
    }
  }

  // Méthode pour modifier un livre existant
  static async updateLivre(livreId, livreData) {
    try {
      const livreRef = doc(firestore, "livres", livreId);
      await updateDoc(livreRef, livreData);

      return "Livre modifié avec succès";
    } catch (error) {
      console.error("Erreur lors de la modification du livre :", error);
      return "Erreur lors de la modification du livre";
    }
  }

  // Méthode pour supprimer un livre
  static async deleteLivre(livreId) {
    try {
      const livreRef = doc(firestore, "livres", livreId);
      await deleteDoc(livreRef);

      return "Livre supprimé avec succès";
    } catch (error) {
      console.error("Erreur lors de la suppression du livre :", error);
      return "Erreur lors de la suppression du livre";
    }
  }
}

export default Livre;

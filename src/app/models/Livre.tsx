import { firestore } from "../firebase";
import { collection, getDocs, doc, setDoc, updateDoc, deleteDoc, query, where } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

class Livre {
  // Attributs essentiels pour définir un livre
  constructor(id, name, price, genre, auteurs, coverUrl, dateAdded, nbr_lecture, nbr_user_note, nbr_vues, note, pdfUrl, small_summary, summary, verdict, annee, edition, format, nbr_pages) {
    this.id = id;
    this.name = name;  // Nom du livre
    this.price = price;  // Prix du livre
    this.genre = genre;  // Genre du livre
    this.auteurs = auteurs;  // Auteur du livre
    this.coverUrl = coverUrl;  // URL de la couverture du livre
    this.dateAdded = dateAdded;  // Date d'ajout du livre
    this.nbr_lecture = nbr_lecture;  // Nombre de lectures
    this.nbr_user_note = nbr_user_note;  // Nombre de notes des utilisateurs
    this.nbr_vues = nbr_vues;  // Nombre de vues
    this.note = note;  // Note moyenne du livre
    this.pdfUrl = pdfUrl;  // URL du PDF du livre
    this.small_summary = small_summary;  // Résumé court du livre
    this.summary = summary;  // Résumé complet du livre
    this.verdict = verdict;  // Verdict de validation du livre
    this.annee = annee;
    this.edition = edition;
    this.format = format;
    this.nbr_pages = nbr_pages;
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

  static async createLivre(livreData) {
    try {
      console.log("Début de la création du livre...");
  
      // Récupérer l'ID de l'auteur depuis le localStorage
      const auteurId = localStorage.getItem("id");
      console.log("ID de l'auteur récupéré depuis le localStorage :", auteurId);
  
      if (!auteurId) {
        throw new Error("Auteur non authentifié. Veuillez vous connecter.");
      }
  
      // Initialiser Firebase Storage
      const storage = getStorage();
  
      // Vérifier que les fichiers sont bien des objets File
      if (!(livreData.coverUrl instanceof File)) {
        throw new Error("coverUrl doit être un objet File.");
      }
      if (!(livreData.pdfUrl instanceof File)) {
        throw new Error("pdfUrl doit être un objet File.");
      }
  
      // Uploader la couverture du livre (coverUrl)
      console.log("Upload de la couverture du livre en cours...");
      const coverRef = ref(storage, `covers/${livreData.coverUrl.name}`);
      await uploadBytes(coverRef, livreData.coverUrl);
      const coverUrl = await getDownloadURL(coverRef);
      console.log("URL de la couverture du livre :", coverUrl);
  
      // Uploader le contenu du livre (pdfUrl)
      console.log("Upload du contenu du livre en cours...");
      const pdfRef = ref(storage, `pdfs/${livreData.pdfUrl.name}`);
      await uploadBytes(pdfRef, livreData.pdfUrl);
      const pdfUrl = await getDownloadURL(pdfRef);
      console.log("URL du contenu du livre :", pdfUrl);
  
      // Créer un objet pour les caractéristiques
      const caracteristiques = {
        annee: livreData.annee,
        edition: livreData.edition,
        format: livreData.format,
        nbr_pages: livreData.nbr_pages,
      };
      console.log("Caractéristiques du livre :", caracteristiques);
  
      // Préparer les données du livre pour Firestore
      const livreFirestoreData = {
        id: livreData.id || doc(collection(firestore, "livres")).id, // Générer un ID si non fourni
        name: livreData.name,
        price: livreData.price,
        genre: livreData.genre,
        auteurs: livreData.auteurs,
        coverUrl: coverUrl, // URL de la couverture après upload
        dateAdded: new Date().toISOString(), // Date d'ajout actuelle
        nbr_lecture: livreData.nbr_lecture || 0, // Valeur par défaut
        nbr_user_note: livreData.nbr_user_note || 0, // Valeur par défaut
        nbr_vues: livreData.nbr_vues || 0, // Valeur par défaut
        note: livreData.note || 0, // Valeur par défaut
        pdfUrl: pdfUrl, // URL du PDF après upload
        small_summary: livreData.small_summary,
        summary: livreData.summary,
        verdict: livreData.verdict || "pending", // Valeur par défaut
        caracteristiques: caracteristiques, // Ajout des caractéristiques
        hauteur: auteurId, // ID de l'auteur récupéré du localStorage
      };
      console.log("Données du livre prêtes pour Firestore :", livreFirestoreData);
  
      // Référence du document Firestore
      const livreRef = doc(firestore, "livres", livreFirestoreData.id);
      console.log("Référence du document Firestore :", livreRef);
  
      // Créer le livre dans Firestore
      await setDoc(livreRef, livreFirestoreData);
      console.log("Livre créé avec succès dans Firestore.");
  
      return "Livre créé avec succès veillez patienter pour sa validation (48Hr)";
    } catch (error) {
      console.error("Erreur lors de la création du livre :", error);
      console.log("Détails de l'erreur :", {
        message: error.message,
        stack: error.stack,
      });
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

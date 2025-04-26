import { firestore } from "../firebase";
import { collection, getDocs, doc, setDoc, updateDoc, deleteDoc, query, where } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

class Livre {
  constructor(id, name, price, genre, auteurs, coverUrl, dateAdded, nbr_lecture, nbr_user_note, nbr_vues, note, pdfUrl, small_summary, summary, verdict, annee, edition, format, nbr_pages, blocApprendre, blocPointCle, nbPointCles) {
    this.id = id;
    this.name = name;
    this.price = price;
    this.genre = genre;
    this.auteurs = auteurs;
    this.coverUrl = coverUrl;
    this.dateAdded = dateAdded;
    this.nbr_lecture = nbr_lecture;
    this.nbr_user_note = nbr_user_note;
    this.nbr_vues = nbr_vues;
    this.note = note;
    this.pdfUrl = pdfUrl;
    this.small_summary = small_summary;
    this.summary = summary;
    this.verdict = verdict;
    this.annee = annee;
    this.edition = edition;
    this.format = format;
    this.nbr_pages = nbr_pages;
    this.blocApprendre = blocApprendre;
    this.blocPointCle = blocPointCle;
    this.nbPointCles = nbPointCles;
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

      const auteurId = localStorage.getItem("id");
      console.log("ID de l'auteur récupéré depuis le localStorage :", auteurId);

      if (!auteurId) {
        throw new Error("Auteur non authentifié. Veuillez vous connecter.");
      }

      const storage = getStorage();

      if (!(livreData.coverUrl instanceof File)) {
        throw new Error("coverUrl doit être un objet File.");
      }
      if (!(livreData.pdfUrl instanceof File)) {
        throw new Error("pdfUrl doit être un objet File.");
      }

      console.log("Upload de la couverture du livre en cours...");
      const coverRef = ref(storage, `covers/${livreData.coverUrl.name}`);
      await uploadBytes(coverRef, livreData.coverUrl);
      const coverUrl = await getDownloadURL(coverRef);
      console.log("URL de la couverture du livre :", coverUrl);

      console.log("Upload du contenu du livre en cours...");
      const pdfRef = ref(storage, `pdfs/${livreData.pdfUrl.name}`);
      await uploadBytes(pdfRef, livreData.pdfUrl);
      const pdfUrl = await getDownloadURL(pdfRef);
      console.log("URL du contenu du livre :", pdfUrl);

      const caracteristiques = {
        annee: livreData.annee,
        edition: livreData.edition,
        format: livreData.format,
        nbr_pages: livreData.nbr_pages,
      };
      console.log("Caractéristiques du livre :", caracteristiques);

      const livreFirestoreData = {
        id: livreData.id || doc(collection(firestore, "livres")).id,
        name: livreData.name,
        price: livreData.price,
        genre: livreData.genre,
        auteurs: livreData.auteurs,
        coverUrl: coverUrl,
        dateAdded: new Date().toISOString(),
        nbr_lecture: livreData.nbr_lecture || 0,
        nbr_user_note: livreData.nbr_user_note || 0,
        nbr_vues: livreData.nbr_vues || 0,
        note: "0",
        pdfUrl: pdfUrl,
        small_summary: livreData.small_summary,
        summary: livreData.summary,
        verdict: livreData.verdict || "loading",
        caracteristiques: caracteristiques,
        hauteur: auteurId,
        revues: [],
        blocApprendre: livreData.blocApprendre || "",
        blocPointCle: livreData.blocPointCle || "",
        nbPointCles: livreData.nbPointCles || 0
      };
      console.log("Données du livre prêtes pour Firestore :", livreFirestoreData);

      const livreRef = doc(firestore, "livres", livreFirestoreData.id);
      console.log("Référence du document Firestore :", livreRef);

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

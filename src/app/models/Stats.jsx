import { firestore } from "../firebase";
import { collection, getDocs, query, where } from "firebase/firestore";

class Stats {
  // Méthode pour compter le nombre de livres écrits par un auteur
  static async nbr_livres(auteurId) {
    try {
      const storedNbrLivres = localStorage.getItem(`nbrLivres_${auteurId}`);
      const lastFetchTime = localStorage.getItem(`lastFetchTime_nbrLivres_${auteurId}`);
      
      const currentTime = new Date().getTime();
      
      // Si les données existent et sont récentes (par exemple, moins de 10 minutes)
      if (storedNbrLivres && lastFetchTime && (currentTime - lastFetchTime < 600000)) {
        return parseInt(storedNbrLivres); // Retourner les données stockées si elles sont récentes
      }
      
      const livresRef = collection(firestore, "livres");
      const q = query(livresRef, where("hauteur", "==", auteurId));
      const querySnapshot = await getDocs(q);

      const nbrLivres = querySnapshot.size; // Nombre total de livres

      // Stocker les résultats dans le localStorage
      localStorage.setItem(`nbrLivres_${auteurId}`, nbrLivres.toString());
      localStorage.setItem(`lastFetchTime_nbrLivres_${auteurId}`, currentTime.toString());

      return nbrLivres;
    } catch (error) {
      console.error("Erreur lors du comptage des livres :", error);
      return 0;
    }
  }

  // Méthode pour calculer le chiffre d'affaires d'un auteur
  static async chiffre_affaire(auteurId) {
    try {
      const storedChiffreAffaire = localStorage.getItem(`chiffreAffaire_${auteurId}`);
      const lastFetchTime = localStorage.getItem(`lastFetchTime_chiffreAffaire_${auteurId}`);
      
      const currentTime = new Date().getTime();

      // Si les données existent et sont récentes (par exemple, moins de 10 minutes)
      if (storedChiffreAffaire && lastFetchTime && (currentTime - lastFetchTime < 600000)) {
        return parseFloat(storedChiffreAffaire); // Retourner les données stockées si elles sont récentes
      }

      const ventesRef = collection(firestore, "ventes_direct");
      const q = query(ventesRef, where("auteur", "==", auteurId), where("etat", "==", "reussi"));
      const querySnapshot = await getDocs(q);

      let total = 0;
      querySnapshot.forEach((doc) => {
        total += doc.data().prix || 0; // Additionne les prix des ventes réussies
      });

      // Stocker les résultats dans le localStorage
      localStorage.setItem(`chiffreAffaire_${auteurId}`, total.toString());
      localStorage.setItem(`lastFetchTime_chiffreAffaire_${auteurId}`, currentTime.toString());

      return total;
    } catch (error) {
      console.error("Erreur lors du calcul du chiffre d'affaires :", error);
      return 0;
    }
  }
}

export default Stats;

import { firestore } from "../firebase";
import { collection, getDocs, query, where } from "firebase/firestore";

class Ventes {
  // Méthode pour obtenir les ventes d'un auteur avec le nombre d'achats par livre
  static async ventes_auteur(auteurId) {
    try {
      console.log("Début de la récupération des ventes pour l'auteur :", auteurId);
      
      const ventesRef = collection(firestore, "ventes_direct");
      const livresRef = collection(firestore, "livres");
      
      // Récupérer toutes les ventes réussies de l'auteur
      const qVentes = query(ventesRef, where("auteur", "==", auteurId), where("etat", "==", "reussi"));
      const ventesSnapshot = await getDocs(qVentes);
      console.log("Nombre de ventes récupérées :", ventesSnapshot.size);
      
      let ventesMap = {};
      let totalVentes = 0;
      
      ventesSnapshot.forEach((doc) => {
        const data = doc.data();
        console.log("Vente trouvée :", data);
        
        const livreId = data.livre.replace(/\s+/g, '_');
        
        if (!ventesMap[livreId]) {
          ventesMap[livreId] = {
            nbr_times: 0,
            price: data.prix,
            time: data.date,
          };
        }
        
        ventesMap[livreId].nbr_times++;
        totalVentes += data.prix;
        
        // Mettre à jour le time avec la dernière vente
        if (data.date > ventesMap[livreId].time) {
          ventesMap[livreId].time = data.date;
        }
      });
      console.log("Données des ventes traitées :", ventesMap);
      
      // Récupérer les informations des livres vendus
      const livresIds = Object.keys(ventesMap);
      console.log("IDs des livres vendus :", livresIds);
      
      let result = [];
      
      for (let livreId of livresIds) {
        console.log("Récupération des infos du livre :", livreId);
        const qLivres = query(livresRef, where("id", "==", livreId));
        const livresSnapshot = await getDocs(qLivres);
        
        if (!livresSnapshot.empty) {
          const livreData = livresSnapshot.docs[0].data();
          console.log("Livre trouvé :", livreData);
          result.push({
            cover_img: livreData.coverUrl,
            title: livreData.name,
            nbr_times: ventesMap[livreId].nbr_times,
            price: ventesMap[livreId].price,
            time: ventesMap[livreId].time,
          });
        } else {
          console.log("Aucun livre trouvé pour l'ID :", livreId);
        }
      }
      
      console.log("Résultat final des ventes :", result, "Total des ventes :", totalVentes);
      return { ventes: result, totalVentes };
    } catch (error) {
      console.error("Erreur lors de la récupération des ventes :", error);
      return { ventes: [], totalVentes: 0 };
    }
  }
}

export default Ventes;

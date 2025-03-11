import { firestore } from "../firebase";
import { collection, getDocs, query, where, updateDoc, doc, getDoc, addDoc, serverTimestamp } from "firebase/firestore";

class Paiements {
  // Méthode pour récupérer toutes les transactions d'un auteur
  static async transactions_auteur(auteurId) {
    try {
        console.log("🔍 Récupération des transactions réussies pour l'auteur :", auteurId);

        const ventesRef = collection(firestore, "ventes_direct");

        // Récupérer toutes les transactions de l'auteur qui ont l'état "reussi"
        const qVentes = query(
            ventesRef,
            where("auteur", "==", auteurId),
            where("etat", "==", "reussi")
        );

        const ventesSnapshot = await getDocs(qVentes);
        console.log("📊 Nombre de transactions réussies récupérées :", ventesSnapshot.size);

        let transactions = [];

        ventesSnapshot.forEach((doc) => {
            const data = doc.data();
            console.log("💰 Transaction réussie trouvée :", data);

            transactions.push({
                auteur: data.auteur,
                date: data.date,
                etat: data.etat,
                livre: data.livre,
                moyen: data.moyen,
                prix: data.prix,
                user: data.user,
            });
        });

        console.log("✅ Transactions finales :", transactions);
        return transactions;
    } catch (error) {
        console.error("❌ Erreur lors de la récupération des transactions :", error);
        return [];
    }
}

  // Méthode pour récupérer le numéro Orange Money de l'auteur
  static async getOrangeMoneyNumber(auteurId) {
    try {
      console.log("Récupération du numéro Orange Money pour l'auteur :", auteurId);
      
      const auteurRef = doc(firestore, "auteurs", auteurId);
      const auteurDoc = await getDoc(auteurRef);
      
      if (auteurDoc.exists()) {
        const orangeMoneyNumber = auteurDoc.data().orangeMoneyNumber || null;
        console.log("Numéro Orange Money récupéré :", orangeMoneyNumber);
        return orangeMoneyNumber;
      } else {
        console.log("Auteur non trouvé");
        return null;
      }
    } catch (error) {
      console.error("Erreur lors de la récupération du numéro Orange Money :", error);
      return null;
    }
  }

  // Méthode pour définir le numéro Orange Money de l'auteur
  static async setOrangeMoneyNumber(auteurId, numero) {
    try {
      console.log("Définition du numéro Orange Money pour l'auteur :", auteurId, "avec le numéro :", numero);
      
      const auteurRef = doc(firestore, "auteurs", auteurId);
      await updateDoc(auteurRef, {
        orangeMoneyNumber: numero,
      });
      
      console.log("Numéro Orange Money défini avec succès");
    } catch (error) {
      console.error("Erreur lors de la définition du numéro Orange Money :", error);
    }
  }

  // Méthode pour récupérer le numéro Mobile Money de l'auteur
  static async getMobileMoneyNumber(auteurId) {
    try {
      console.log("Récupération du numéro Mobile Money pour l'auteur :", auteurId);
      
      const auteurRef = doc(firestore, "auteurs", auteurId);
      const auteurDoc = await getDoc(auteurRef);
      
      if (auteurDoc.exists()) {
        const mobileMoneyNumber = auteurDoc.data().mobileMoneyNumber || null;
        console.log("Numéro Mobile Money récupéré :", mobileMoneyNumber);
        return mobileMoneyNumber;
      } else {
        console.log("Auteur non trouvé");
        return null;
      }
    } catch (error) {
      console.error("Erreur lors de la récupération du numéro Mobile Money :", error);
      return null;
    }
  }

  // Méthode pour définir le numéro Mobile Money de l'auteur
  static async setMobileMoneyNumber(auteurId, numero) {
    try {
      console.log("Définition du numéro Mobile Money pour l'auteur :", auteurId, "avec le numéro :", numero);
      
      const auteurRef = doc(firestore, "auteurs", auteurId);
      await updateDoc(auteurRef, {
        mobileMoneyNumber: numero,
      });
      
      console.log("Numéro Mobile Money défini avec succès");
    } catch (error) {
      console.error("Erreur lors de la définition du numéro Mobile Money :", error);
    }
  }

  // Méthode pour récupérer le solde de l'auteur
  static async getSolde(auteurId) {
    try {
      console.log("Récupération du solde pour l'auteur :", auteurId);
      
      const auteurRef = doc(firestore, "auteurs", auteurId);
      const auteurDoc = await getDoc(auteurRef);
      
      if (auteurDoc.exists()) {
        const solde = Number(auteurDoc.data().solde);
        console.log("nom :", auteurDoc.data().NomPrenom);
        console.log("Solde récupéré :", solde);
        return solde;
      } else {
        console.log("Auteur non trouvé");
        return 0;
      }
    } catch (error) {
      console.error("Erreur lors de la récupération du solde :", error);
      return 0;
    }
  }

  // Méthode pour mettre à jour le solde de l'auteur
  static async setSolde(auteurId, nouveauSolde) {
    try {
      console.log("Mise à jour du solde pour l'auteur :", auteurId, "avec la valeur :", nouveauSolde);
      
      const auteurRef = doc(firestore, "auteurs", auteurId);
      await updateDoc(auteurRef, {
        solde: nouveauSolde,
      });
      
      console.log("Solde mis à jour avec succès");
    } catch (error) {
      console.error("Erreur lors de la mise à jour du solde :", error);
    }
  }

  // Méthode pour récupérer le seuil de paiement depuis la collection "global"
  static async getSeuil() {
    try {
      console.log("Récupération du seuil de paiement depuis la collection 'global'");
      
      const globalRef = collection(firestore, "global");
      const globalSnapshot = await getDocs(globalRef);
      
      if (!globalSnapshot.empty) {
        // On suppose qu'il n'y a qu'un seul document dans la collection "global"
        const globalDoc = globalSnapshot.docs[0];
        const seuilAuteur = globalDoc.data().seuilAuteur || 0;
        console.log("Seuil de paiement récupéré :", seuilAuteur);
        return seuilAuteur;
      } else {
        console.log("Aucun document trouvé dans la collection 'global'");
        return 0;
      }
    } catch (error) {
      console.error("Erreur lors de la récupération du seuil de paiement :", error);
      return 0;
    }
  }

  // Méthode pour créer un retrait
  static async creerRetrait(auteurId, montant) {
    try {
      console.log("Création d'un retrait pour l'auteur :", auteurId, "avec le montant :", montant);
      
      const ventesRef = collection(firestore, "ventes_direct");
      
      // Créer la transaction de retrait
      const nouvelleTransaction = {
        auteur: auteurId,
        prix: montant,
        type: "retrait",
        date: serverTimestamp(), // Date et heure actuelles
        etat: "reussi", // Par défaut, le retrait est réussi
      };
      
      // Ajouter la transaction à la collection "ventes_direct"
      await addDoc(ventesRef, nouvelleTransaction);
      
      console.log("Retrait créé avec succès");
    } catch (error) {
      console.error("Erreur lors de la création du retrait :", error);
    }
  }
}

export default Paiements;
import { firestore } from "../firebase";
import { collection, getDocs, query, orderBy, where, updateDoc, doc } from "firebase/firestore";
import emailjs from "@emailjs/browser"; // Nécessite configuration EmailJS

type AuteurType = {
  id: string;
  NomPrenom?: string;
  email?: string;
  ville?: string;
  metier?: string;
  date?: string | { seconds: number };
  tel?: string;
  nationalite?: string;
  avezVousDejaEcris?: string;
  titreLivre?: string;
  solde?: number;
  description?: string;
  courteDescription?: string;
  password_visible?: string;
  // Ajoute d'autres champs si besoin
};

// Ajoute un type pour la notification
type NotifType = {
  message: string;
  date?: string;
  // Ajoute d'autres champs si besoin
};

class ValidationAuteurs {
  // Récupérer tous les auteurs, du plus récent au plus ancien
  static async getAuteurs(filter = "") {
    try {
      const auteursRef = collection(firestore, "auteurs"); // ← ici
      let q = query(auteursRef, orderBy("date", "desc"));
      if (filter) {
        // Filtre sur le nom, prénom ou email
        q = query(
          auteursRef,
          where("NomPrenom", ">=", filter),
          where("NomPrenom", "<=", filter + "\uf8ff"),
          orderBy("date", "desc")
        );
      }
      const snapshot = await getDocs(q);
      return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    } catch (e) {
      console.error("Erreur récupération auteurs:", e);
      return [];
    }
  }

  // Envoyer les accès par email à un auteur
  static async sendAccessByEmail(auteur: AuteurType) {
    try {
      // Nécessite configuration EmailJS (voir https://www.emailjs.com/)
      await emailjs.send(
        "service_20ighhj", // à remplacer
        "template_2idgvxk", // à remplacer
        {
          to_email: auteur.email,
          to_name: auteur.NomPrenom,
          password: auteur.password_visible,
        },
        "y14AbcD4dgYbokI1n" // à remplacer
      );
      return true;
    } catch (e) {
      console.error("Erreur envoi email:", e);
      return false;
    }
  }

  // Ajouter une notification à un auteur
  static async notifyAuteur(auteurId: string, notif: NotifType) {
    try {
      const auteurRef = doc(firestore, "auteurs", auteurId);
      // On récupère les notifs existantes
      const auteurSnap = await getDocs(query(collection(firestore, "auteurs"), where("id", "==", auteurId)));
      let notifs: NotifType[] = [];
      if (!auteurSnap.empty) {
        notifs = auteurSnap.docs[0].data().notif || [];
      }
      notifs.push({ ...notif, date: new Date().toISOString() });
      await updateDoc(auteurRef, { notif: notifs });
      return true;
    } catch (e) {
      console.error("Erreur notification:", e);
      return false;
    }
  }

  // Notifier tous les auteurs
  static async notifyAllAuteurs(notif: NotifType) {
    const auteurs = await this.getAuteurs();
    for (const auteur of auteurs) {
      await this.notifyAuteur(auteur.id, notif);
    }
  }
}

export default ValidationAuteurs;
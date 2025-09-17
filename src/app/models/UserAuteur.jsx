import { doc, getDoc, updateDoc } from "firebase/firestore";
import { firestore } from "../firebase";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

class UserAuteur {
  constructor(data) {
    this.id = data.id;
    this.nom = data.nom;
    this.prenom = data.prenom;
    this.NomPrenom = data.NomPrenom;
    this.email = data.email;
    this.tel = data.tel;
    this.ville = data.ville;
    this.metier = data.metier;
    this.nationalite = data.nationalite;
    this.photo = data.photo;
    this.solde = data.solde;
    this.avezVousDejaEcris = data.avezVousDejaEcris;
    this.courteDescription = data.courteDescription;
    this.description = data.description;
    this.titreLivre = data.titreLivre;
    this.date = data.date;
    this.password = data.password;
    this.password_visible = data.password_visible;
  }

  static async getById(id) {
    const docRef = doc(firestore, "auteurs", id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return new UserAuteur({ ...docSnap.data(), id });
    }
    return null;
  }

  async updateProfile(updates) {
    const docRef = doc(firestore, "auteurs", this.id);
    await updateDoc(docRef, updates);
    Object.assign(this, updates);
  }

  async updatePhoto(file) {
    const storage = getStorage();
    const photoRef = ref(storage, `auteurs/${this.id}/photo_${file.name}`);
    await uploadBytes(photoRef, file);
    const photoUrl = await getDownloadURL(photoRef);
    await this.updateProfile({ photo: photoUrl });
    this.photo = photoUrl;
    return photoUrl;
  }

  async changePassword(newPassword) {
    // Hash password (SHA256)
    const hashed = await import("crypto-js").then(CryptoJS => CryptoJS.SHA256(newPassword).toString());
    await this.updateProfile({
      password: hashed,
      password_visible: newPassword
    });
    this.password = hashed;
    this.password_visible = newPassword;
  }
}

export default UserAuteur;
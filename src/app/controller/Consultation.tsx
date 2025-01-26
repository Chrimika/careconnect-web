import moment from 'moment';
import { jsPDF } from "jspdf";
import JsBarcode from "jsbarcode";
import { firestore } from "../firebase"; // Import de la configuration Firebase
import { collection, addDoc } from "@firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

class Consultation {
  id: string;
  date: Date;
  heure: string;
  nomPatient: string;
  prenomPatient: string;
  typeConsultation: string;
  prix: number;
  recue: string;

  constructor(
    id: string,
    date: Date,
    heure: string,
    nomPatient: string,
    prenomPatient: string,
    typeConsultation: string,
    prix: number,
    recue: string
  ) {
    this.id = id;
    this.date = date;
    this.heure = heure;
    this.nomPatient = nomPatient;
    this.prenomPatient = prenomPatient;
    this.typeConsultation = typeConsultation;
    this.prix = prix;
    this.recue = recue
  }

  // Méthode pour obtenir les informations complètes de la consultation
  getDetails(): string {
    return `Consultation de type "${this.typeConsultation}" pour ${this.prenomPatient} ${this.nomPatient}, prévue le ${moment(this.date).format(
      'dddd D MMMM YYYY'
    )} à ${this.heure}. Prix : ${this.prix} FCFA`;
  }

  // Méthode statique pour lister les consultations (peut être connectée à une API)
  static listerConsultations(): Consultation[] {
    return [
      new Consultation('asdkakjk2323', new Date(), '10:00', 'Doe', 'John', 'Générale', 50000,''),
      new Consultation('qwertyui7890', new Date(), '14:30', 'Smith', 'Jane', 'Spécialiste', 100000,''),
    ];
  }

  // Méthode pour générer le PDF et sauvegarder les données
  generateAndSaveInvoice = async () => {
    // Afficher le loader
    const loadingElement = document.querySelector(".loading-content");
    if (loadingElement) loadingElement.style.display = "flex";
  
    try {
      const doc = new jsPDF();
  
      // Générer le PDF
      doc.setFont("helvetica", "bold");
      doc.setFontSize(18);
      doc.text("CLINIQUE ABC", 105, 20, { align: "center" });
      doc.setFontSize(14);
      doc.text("Facture de Consultation", 105, 30, { align: "center" });
  
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.text("Adresse : Rue XYZ, Ville ABC", 20, 40);
      doc.text("Téléphone : +228 90000000", 20, 45);
      doc.text("Email : contact@cliniqueabc.com", 20, 50);
  
      doc.line(20, 55, 190, 55);
      doc.setFontSize(12);
      doc.text(`Date de consultation : ${moment(this.date).format("DD/MM/YYYY")}`, 20, 65);
      doc.text(`Heure : ${this.heure}`, 20, 72);
      doc.text(`Type de consultation : ${this.typeConsultation}`, 20, 79);
      doc.text(`Nom du patient : ${this.prenomPatient} ${this.nomPatient}`, 20, 86);
      doc.setFont("helvetica", "bold");
      doc.text(`Montant : ${this.prix} FCFA`, 20, 96);
      doc.setFontSize(14);
      doc.setTextColor(0, 102, 0);
      doc.text(`TOTAL : ${this.prix} FCFA`, 20, 110);
  
      const canvas = document.createElement("canvas");
      JsBarcode(canvas, this.id, { format: "CODE128" });
      const barcodeBase64 = canvas.toDataURL("image/png");
      doc.addImage(barcodeBase64, "PNG", 80, 130, 50, 20);
  
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.text("Merci pour votre confiance !", 105, 170, { align: "center" });
  
      // Convertir le PDF en Blob pour l'envoyer à Firebase Storage
      const pdfBlob = doc.output("blob");
  
      // Sauvegarder le fichier PDF dans Firebase Storage
      const storage = getStorage();
      const fileRef = ref(
        storage,
        `Consultations/Facture_${this.prenomPatient}_${this.nomPatient}_${moment().format(
          "YYYYMMDD_HHmmss"
        )}.pdf`
      );
      const uploadResult = await uploadBytes(fileRef, pdfBlob);
      const pdfUrl = await getDownloadURL(uploadResult.ref);
  
      // Sauvegarder les données dans Firestore
      const consultationData = {
        date: this.date,
        heure: this.heure,
        nomPatient: this.nomPatient,
        prenomPatient: this.prenomPatient,
        typeConsultation: this.typeConsultation,
        prix: this.prix,
        pdfUrl: pdfUrl, // URL du fichier PDF
      };
  
      const docRef = await addDoc(collection(firestore, "Consultations"), consultationData);
      this.id = docRef.id; // Met à jour l'ID de la consultation avec celui du document Firestore
  
      alert(`Consultation enregistrée avec succès !`);

    } catch (error) {
      console.error("Une erreur est survenue :", error);
    } finally {
      // Masquer le loader
      if (loadingElement) loadingElement.style.display = "none";
    }
  };
  
  
}


export default Consultation;

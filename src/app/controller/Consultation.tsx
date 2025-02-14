import moment from "moment";
import { jsPDF } from "jspdf";
import JsBarcode from "jsbarcode";
import { firestore } from "../firebase"; // Import de la configuration Firebase
import { collection, addDoc, updateDoc, doc } from "@firebase/firestore";
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
    this.recue = recue;
  }

  // Méthode pour générer le PDF et sauvegarder les données
  generateAndSaveInvoice = async () => {
    // Afficher le loader
    const loadingElement = document.querySelector(".loading-content");
    if (loadingElement) loadingElement.style.display = "flex";

    try {
      // Étape 1 : Sauvegarder la consultation dans Firestore sans l'ID
      const consultationData = {
        date: this.date,
        heure: this.heure,
        nomPatient: this.nomPatient,
        prenomPatient: this.prenomPatient,
        typeConsultation: this.typeConsultation,
        prix: this.prix,
        pdfUrl: "",
        etat: "valide"
      };

      const docRef = await addDoc(collection(firestore, "Consultations"), consultationData);

      // Étape 2 : Récupérer l'ID Firestore et l'affecter à l'objet
      this.id = docRef.id;

      // Étape 3 : Générer le PDF avec l'ID Firestore
      const pdfDoc = new jsPDF();
      pdfDoc.setFont("helvetica", "bold");
      pdfDoc.setFontSize(18);
      pdfDoc.text("CLINIQUE ABC", 105, 20, { align: "center" });
      pdfDoc.setFontSize(14);
      pdfDoc.text("Facture de Consultation", 105, 30, { align: "center" });

      pdfDoc.setFont("helvetica", "normal");
      pdfDoc.setFontSize(10);
      pdfDoc.text("Adresse : Rue XYZ, Ville ABC", 20, 40);
      pdfDoc.text("Téléphone : +228 90000000", 20, 45);
      pdfDoc.text("Email : contact@cliniqueabc.com", 20, 50);

      pdfDoc.line(20, 55, 190, 55);
      pdfDoc.setFontSize(12);
      pdfDoc.text(`Date de consultation : ${moment(this.date).format("DD/MM/YYYY")}`, 20, 65);
      pdfDoc.text(`Heure : ${this.heure}`, 20, 72);
      pdfDoc.text(`Type de consultation : ${this.typeConsultation}`, 20, 79);
      pdfDoc.text(`Nom du patient : ${this.prenomPatient} ${this.nomPatient}`, 20, 86);
      pdfDoc.setFont("helvetica", "bold");
      pdfDoc.text(`Montant : ${this.prix} FCFA`, 20, 96);
      pdfDoc.setFontSize(14);
      pdfDoc.setTextColor(0, 102, 0);
      pdfDoc.text(`TOTAL : ${this.prix} FCFA`, 20, 110);

      // Générer le code-barres avec l'ID Firestore
      const canvas = document.createElement("canvas");
      JsBarcode(canvas, this.id, { format: "CODE128" });
      const barcodeBase64 = canvas.toDataURL("image/png");
      pdfDoc.addImage(barcodeBase64, "PNG", 80, 130, 50, 20);

      pdfDoc.setFontSize(12);
      pdfDoc.setTextColor(0, 0, 0);
      pdfDoc.text("Merci pour votre confiance !", 105, 170, { align: "center" });

      // Étape 4 : Uploader le PDF sur Firebase Storage
      const pdfBlob = pdfDoc.output("blob");
      const storage = getStorage();
      const fileRef = ref(
        storage,
        `Consultations/Facture_${this.prenomPatient}_${this.nomPatient}_${moment().format(
          "YYYYMMDD_HHmmss"
        )}.pdf`
      );

      const uploadResult = await uploadBytes(fileRef, pdfBlob);
      const pdfUrl = await getDownloadURL(uploadResult.ref);

      // Étape 5 : Mettre à jour Firestore avec l'ID et l'URL du PDF
      await updateDoc(doc(firestore, "Consultations", this.id), {
        id: this.id,
        pdfUrl: pdfUrl,
      });

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

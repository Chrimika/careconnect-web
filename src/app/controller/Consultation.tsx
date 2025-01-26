import moment from 'moment';

class Consultation {
  id: string;
  date: Date;
  heure: string;
  nomPatient: string;
  prenomPatient: string;
  typeConsultation: string;
  prix: number;  // Nouveau champ pour le prix

  constructor(
    id: string,
    date: Date,
    heure: string,
    nomPatient: string,
    prenomPatient: string,
    typeConsultation: string,
    prix: number  // Ajouter le prix dans le constructeur
  ) {
    this.id = id
    this.date = date;
    this.heure = heure;
    this.nomPatient = nomPatient;
    this.prenomPatient = prenomPatient;
    this.typeConsultation = typeConsultation;
    this.prix = prix;  // Initialisation du prix
  }

  // Méthode pour obtenir les informations complètes de la consultation
  getDetails(): string {
    return `Consultation de type "${this.typeConsultation}" pour ${this.prenomPatient} ${this.nomPatient}, prévue le ${moment(this.date).format(
      'dddd D MMMM YYYY'
    )} à ${this.heure}. Prix : ${this.prix}FCFA`;
  }

  // Méthode statique pour lister les consultations (peut être connectée à une API)
  static listerConsultations(): Consultation[] {
    return [
      new Consultation('asdkakjk2323',new Date(), '10:00', 'Doe', 'John', 'Générale', 50), 
      new Consultation('asdkakjk2323',new Date(), '14:30', 'Smith', 'Jane', 'Spécialiste', 100),  
    ];
  }
  
}

// Export de la classe
export default Consultation;

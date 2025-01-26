"use client"

import React, { useMemo } from 'react';
import moment from 'moment';
import 'moment/locale/fr';
import { useState } from 'react';
import { Swiper } from 'swiper/react';
import 'swiper/css'; 
import { jsPDF } from "jspdf";
import Consultation from '../controller/Consultation'; // La classe Consultation n'a pas changé

moment.locale('fr');

export default function ConsultationsScreen() {
  const [value, setValue] = useState(new Date());
  const [week, setWeek] = useState(0);
  const [selectedHour, setSelectedHour] = useState(null);

  const hours = useMemo(() => {
    // Générer des heures de 00:00 à 23:30 par incréments de 30 minutes
    return Array.from({ length: 48 }, (_, index) => {
      return moment().startOf('day').add(index * 30, 'minutes').format('HH:mm');
    });
  }, []);

  const weeks = useMemo(() => {
    const start = moment().startOf('week'); // Commence à la semaine courante
    return [0, 1, 2].map((adj) => {
      return Array.from({ length: 7 }).map((_, index) => {
        const date = moment(start).add(adj, 'week').add(index, 'day');
        return {
          weekday: date.format('ddd').replace('.', ''),
          date: date.toDate(),
        };
      });
    });
  }, [week]);

  const handleConfirmAppointment = () => {
    if (selectedHour) {
      const consultation = new Consultation(
        "baa1293nmf",
        value,
        selectedHour,
        'Doe',
        'John',
        'Générale',
        3000
      );
      alert(consultation.getDetails());
      generateInvoice(consultation);
    } else {
      alert('Veuillez sélectionner une heure.');
    }
  };

  // Fonction pour générer la facture (PDF)
  const generateInvoice = (consultation) => {
    const doc = new jsPDF();
    
    // Titre
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.text("Facture de Consultation", 20, 20);
    
    // Détails de la consultation
    doc.setFontSize(12);
    doc.text(`Date de consultation: ${moment(consultation.date).format('dddd D MMMM YYYY')}`, 20, 40);
    doc.text(`Heure: ${consultation.heure}`, 20, 50);
    doc.text(`Consultation: ${consultation.typeConsultation}`, 20, 60);
    
    // Informations sur le patient
    doc.text(`Nom: ${consultation.prenomPatient} ${consultation.nomPatient}`, 20, 70);
    
    // Prix (exemple statique, vous pouvez ajuster selon le type de consultation ou d'autres facteurs)
    doc.text(`Prix: ${consultation.prix}FCFA`, 20, 80);
    
    // Total
    doc.text(`Montant total: ${consultation.prix}FRCFA`, 20, 90);

    // Signature
    doc.text("Merci pour votre confiance!", 20, 110);
    
    // Sauvegarde du PDF
    doc.save(`Facture_${consultation.prenomPatient}_${consultation.nomPatient}_${moment().format('YYYYMMDD_HHmmss')}.pdf`);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', padding: '24px', border: '1px solid black', flex:1, height: '100vh' }}>
      <div style={{ padding: '0 16px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: '700', color: '#1d1d1d', marginBottom: '12px' }}>
          Vos disponibilités
        </h1>
      </div>
      <div style={{ padding: '12px 0', flexDirection: 'row', alignItems: 'center' }}>
        <Swiper
          slidesPerView={1}
          spaceBetween={0}
          loop={false}
          style={{ }}  // Hauteur minimale pour le Swiper
          onSlideChange={(swiper) => {
            const newIndex = swiper.realIndex;
            setWeek(newIndex);  // Met à jour la semaine affichée
            setValue(moment().add(newIndex, 'week').toDate());  // Change la date de la semaine courante
          }}
        >
          {weeks.map((dates, weekIndex) => (
            <div key={`week-${weekIndex}`} style={{ display: 'flex', padding: '0 16px' }}>
              {dates.map((item, dateIndex) => {
                const isActive = value.toDateString() === item.date.toDateString();
                return (
                  <button
                    key={dateIndex}
                    onClick={() => setValue(item.date)}
                    style={{
                      flex: 1,
                      height: '50px',
                      margin: '0 4px',
                      padding: '4px 8px',
                      borderRadius: '8px',
                      backgroundColor: isActive ? '#0bcb95' : '#fff',
                      borderColor: isActive ? '#0bcb95' : '#fff',
                      textAlign: 'center',
                    }}
                  >
                    <p style={{ fontSize: '13px', color: isActive ? '#fff' : '#737373' }}>
                      {item.weekday}
                    </p>
                    <p style={{ fontSize: '15px', color: isActive ? '#fff' : '#111' }}>
                      {item.date.getDate()}
                    </p>
                  </button>
                );
              })}
            </div>
          ))}
        </Swiper>
      </div>
      <div style={{ flex: 1, padding: '16px', paddingTop: '24px' }}>
        <div style={{ marginBottom: '16px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#333', marginBottom: '12px' }}>
            Choisissez une heure
          </h3>
          <div style={{ display: 'flex', overflowX: 'scroll', marginBottom: '16px' }}>
            {hours.map((hour, index) => {
              const isSelected = hour === selectedHour;
              return (
                <button
                  key={index}
                  onClick={() => setSelectedHour(hour)}
                  style={{
                    padding: '12px',
                    marginRight: '8px',
                    border: '1px solid #e0e0e0',
                    borderRadius: '8px',
                    backgroundColor: isSelected ? '#0bcb95' : '#fff',
                    color: isSelected ? '#fff' : '#333',
                    fontSize: '14px',
                    textAlign: 'center',
                  }}
                >
                  {hour}
                </button>
              );
            })}
          </div>
          <p style={{ fontSize: '17px', fontWeight: '600', color: '#0bcb95', marginBottom: '12px' }}>
            {moment(value).format('dddd D MMMM YYYY')} à {selectedHour}Hr
          </p>
        </div>
      </div>
      <div style={{ marginTop: '24px', padding: '16px'}}>
        <button
          onClick={handleConfirmAppointment}
          style={{
            display: 'flex',
            backgroundColor: '#0bcb95',
            borderColor: '#0bcb95',
            padding: '10px 20px',
            borderRadius: '8px',
            color: '#fff',
            fontSize: '18px',
            fontWeight: '600',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%'
          }}
        >
          Prendre rendez-vous
        </button>
      </div>
    </div>
  );
}

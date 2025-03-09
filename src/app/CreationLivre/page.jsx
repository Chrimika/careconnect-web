"use client";
import { Pencil, Trash2, Plus, ChevronRight, ImportIcon, Upload } from "lucide-react";
import Header from "@/app/components/Header";
import { useState, useEffect } from "react";
import Livre from '../models/Livre'
import { useRouter } from "next/navigation";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const CreateLivre = () => {
    const router = useRouter();
  // États pour la navigation et les données du livre
  const [currentStep, setCurrentStep] = useState(1);
  const [livreData, setLivreData] = useState({
    titre: "",
    sousTitre: "",
    annee: "",
    format: "",
    nombrePages: "",
    categorie: "",
    description: "",
    contenuLivre: null,
    couvertureLivre: null,
    auteur: "",
    prix: "",
    redevance: "",
  });
  const [previewPdfUrl, setPreviewPdfUrl] = useState(null);
  const [previewImageUrl, setPreviewImageUrl] = useState(null);
  

  // Validation des champs pour chaque étape
  const validateStep = (step) => {
    switch (step) {
      case 1:
        return (
          livreData.titre &&
          livreData.sousTitre &&
          livreData.annee &&
          livreData.format &&
          livreData.nombrePages &&
          livreData.categorie &&
          livreData.description
        );
      case 2:
        return livreData.contenuLivre && livreData.couvertureLivre;
      case 3:
        return livreData.auteur && livreData.prix;
      default:
        return false;
    }
  };

  // Gestion de la navigation entre les étapes
  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
    } else {
      alert("Veuillez remplir tous les champs requis avant de passer à l'étape suivante.");
    }
  };

  const handlePreviousStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleFileChange = async (event, type) => {
    const file = event.target.files[0];
    if (file) {
      try {
        console.log(`Fichier ${type} sélectionné :`, file);

        // Uploader le fichier vers Firebase Storage
        const storage = getStorage();
        const fileRef = ref(storage, `${type}s/${file.name}`);
        await uploadBytes(fileRef, file);
        const fileUrl = await getDownloadURL(fileRef);
        console.log(`URL du fichier ${type} :`, fileUrl);

        // Mettre à jour l'état avec l'URL du fichier
        if (type === "pdf") {
          setLivreData((prevData) => ({
            ...prevData,
            pdfUrl: fileUrl, // Stocker l'URL du PDF
            contenuLivre: file, // Stocker le fichier PDF (optionnel)
          }));
        } else if (type === "image") {
          setLivreData((prevData) => ({
            ...prevData,
            coverUrl: fileUrl, // Stocker l'URL de l'image
            couvertureLivre: file, // Stocker le fichier image (optionnel)
          }));
        }

        // Mettre à jour la prévisualisation
        const filePreviewUrl = URL.createObjectURL(file);
        if (type === "pdf") {
          setPreviewPdfUrl(filePreviewUrl);
        } else if (type === "image") {
          setPreviewImageUrl(filePreviewUrl);
        }
      } catch (error) {
        console.error(`Erreur lors de l'upload du fichier ${type} :`, error);
      }
    }
  };

  // Calcul de la redevance
  const handlePrixChange = (event) => {
    const prix = event.target.value;
    const redevance = prix * 0.7;
    setLivreData({ ...livreData, prix, redevance });
  };

  const handleSubmit = async () => {
    if (validateStep(3)) {
      // Créer une instance de la classe Livre avec les données du formulaire
      const livre = new Livre(
        null, // ID (sera généré automatiquement par Firestore)
        livreData.titre, // name
        livreData.prix, // price
        livreData.categorie, // genre
        [livreData.auteur], // auteurs (sous forme de tableau)
        livreData.couvertureLivre, // coverUrl (objet File)
        new Date().toISOString(), // dateAdded
        0, // nbr_lecture (valeur par défaut)
        0, // nbr_user_note (valeur par défaut)
        0, // nbr_vues (valeur par défaut)
        0, // note (valeur par défaut)
        livreData.contenuLivre, // pdfUrl (objet File)
        livreData.sousTitre, // small_summary
        livreData.description, // summary
        "loading", // verdict
        livreData.annee, // annee
        "Papers book", // edition
        livreData.format, // format
        livreData.nombrePages // nbr_pages
      );
  
      // Appeler la méthode createLivre pour enregistrer le livre dans Firestore
      const result = await Livre.createLivre(livre);
  
      // Afficher le résultat et rediriger l'utilisateur
      alert(result);
      router.push("../Livres");
    } else {
      alert("Veuillez remplir tous les champs requis avant de soumettre.");
    }
  };

  // Rendu conditionnel des étapes
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <InfoLivre livreData={livreData} setLivreData={setLivreData} />;
      case 2:
        return (
          <ContenuLivre
            handleFileChange={handleFileChange}
            previewPdfUrl={previewPdfUrl}
            previewImageUrl={previewImageUrl}
          />
        );
      case 3:
        return <PrixAuteur livreData={livreData} handlePrixChange={handlePrixChange} setLivreData={setLivreData}/>;
      default:
        return null;
    }
  };

  return (
    <div
      style={{
        margin: 0,
        flex: 1,
        padding: "16px 16px",
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        width: "100%",
      }}
    >
      <div style={{ flex: 0.1 }}>
        <Header title="Creation Livre" subTitle="" />
      </div>
      <div style={{ flex: 0.8 }}>{renderStep()}</div>
      <div style={{ flex: 0.1 }}>
        {currentStep === 3 ? (
          <button
            style={{
              backgroundColor: "#0cc0df",
              height: 78,
              width: "100%",
              borderRadius: 15,
            }}
            onClick={handleSubmit}
          >
            <p style={{ color: "#fff", fontWeight: "bold" }}>Soumettre</p>
          </button>
        ) : (
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <button onClick={handlePreviousStep} disabled={currentStep === 1}>
              Précédent
            </button>
            <button onClick={handleNextStep} disabled={currentStep === 3}>
              Suivant
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// Composant InfoLivre
const InfoLivre = ({ livreData, setLivreData }) => {
  const handleChange = (field, value) => {
    setLivreData({ ...livreData, [field]: value });
  };

  const categories = [
    "Arts & Photography",
    "Business & Money",
    "Comics, Manga & Graphic Novels",
    "Cookbooks, Food & Wine",
    "Education & Teaching",
    "Foreign Languages",
    "History",
    "Law",
    "Literature & Fiction",
    "Mystery, Thriller & Suspense",
    "Parenting & Relationships",
    "Reference",
    "Romance",
    "Science Fiction & Fantasy",
    "Sports & Outdoors",
    "Travel",
    "Biographies & Memories",
    "Children's eBooks",
    "Computers & Technology",
    "Crafts, Hobbies & Home",
    "Engineering & Transportation",
    "Health, Fitness & Dieting",
    "Humor & Entertainment",
    "Medical eBooks",
    "Nonfiction",
    "Politics & Social Sciences",
    "Religion & Spirituality",
    "Science & Math",
    "Self-Help",
    "Teen & Young Adult",
  ];

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div>
          <p style={{ fontSize: 14, maxWidth: 100 }}>Informations du livre</p>
          <div
            style={{
              width: 36,
              height: 6,
              backgroundColor: "#0cc0df",
              borderRadius: 15,
            }}
          ></div>
        </div>
        <div>
          <p style={{ fontSize: 14, maxWidth: 100 }}>Contenu du livre</p>
        </div>
        <div>
          <p style={{ fontSize: 14, maxWidth: 100 }}>Prix & auteur du livre</p>
        </div>
      </div>

      <div>
        <div style={{ marginTop: 32 }}>
          <p>Titre du livre</p>
          <input
            style={{ width: "100%", height: 47, backgroundColor: "#f3f3f3" }}
            value={livreData.titre}
            onChange={(e) => handleChange("titre", e.target.value)}
          />

          <p style={{ marginTop: 16 }}>Sous titre</p>
          <input
            style={{ width: "100%", height: 47, backgroundColor: "#f3f3f3" }}
            value={livreData.sousTitre}
            onChange={(e) => handleChange("sousTitre", e.target.value)}
          />

          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div>
              <p style={{ marginTop: 16 }}>Année</p>
              <input
                style={{ width: "100%", height: 47, backgroundColor: "#f3f3f3" }}
                value={livreData.annee}
                type="number"
                onChange={(e) => handleChange("annee", e.target.value)}
              />
            </div>
            <div style={{ margin: "0 16px" }}>
                <p style={{ marginTop: 12, fontSize: 14, fontWeight: "500" }}>Format</p>
                <select
                    style={{
                    width: "100%",
                    height: 47,
                    backgroundColor: "#f3f3f3",
                    border: "1px solid #ddd",
                    padding: "8px",
                    fontSize: 14,
                    marginTop:7
                    }}
                    value={livreData.format}
                    onChange={(e) => handleChange("format", e.target.value)}
                >
                    <option value="">Sélectionner un format</option>
                    <option value="A4">A4 (21 × 29.7 cm)</option>
                    <option value="A5">A5 (14.8 × 21 cm)</option>
                    <option value="A6">A6 (10.5 × 14.8 cm)</option>
                    <option value="B5">B5 (17.6 × 25 cm)</option>
                    <option value="Letter">Letter (21.6 × 27.9 cm)</option>
                </select>
                </div>
            <div>
              <p style={{ marginTop: 16 }}>Nombre pages</p>
              <input
                style={{ width: "100%", height: 47, backgroundColor: "#f3f3f3" }}
                value={livreData.nombrePages}
                type="number"
                onChange={(e) => handleChange("nombrePages", e.target.value)}
              />
            </div>
          </div>

            <p style={{ marginTop: 16 }}>Catégorie</p>
            <select
                style={{
                width: "100%",
                height: 47,
                backgroundColor: "#f3f3f3",
                border: "none",
                padding: "8px",
                fontSize: 16,
                }}
                value={livreData.categorie}
                onChange={(e) => handleChange("categorie", e.target.value)}
            >
                <option value="" disabled>
                Choisir une catégorie
                </option>
                {categories.map((category) => (
                <option key={category} value={category}>
                    {category}
                </option>
                ))}
            </select>

          <p style={{ marginTop: 16 }}>Description</p>
          <textarea
            style={{ width: "100%", height: 174, backgroundColor: "#f3f3f3" }}
            value={livreData.description}
            onChange={(e) => handleChange("description", e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

// Composant ContenuLivre
const ContenuLivre = ({ handleFileChange, previewPdfUrl, previewImageUrl }) => {
    return (
      <div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div>
            <p style={{ fontSize: 14, maxWidth: 100 }}>Informations du livre</p>
          </div>
          <div>
            <p style={{ fontSize: 14, maxWidth: 100 }}>Contenu du livre</p>
            <div
              style={{
                width: 36,
                height: 6,
                backgroundColor: "#0cc0df",
                borderRadius: 15,
              }}
            ></div>
          </div>
          <div>
            <p style={{ fontSize: 14, maxWidth: 100 }}>Prix & auteur du livre</p>
          </div>
        </div>
  
        {/* Section pour uploader le PDF */}
        <div style={{ marginTop: 32 }}>
          <p>Contenu du livre</p>
          <label
            htmlFor="pdf-upload"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              cursor: "pointer",
              backgroundColor: "#0cc0df",
              padding: "10px",
              borderRadius: "15px",
              transition: "background-color 0.2s",
              fontWeight: "500",
              width: 177,
              height: 47,
              marginTop: 8,
            }}
          >
            <Upload size={20} color="#fff" />
            <span style={{ color: "white", fontWeight: 14 }}>Importer un livre</span>
          </label>
          <input
            id="pdf-upload"
            type="file"
            accept="application/pdf"
            style={{ display: "none" }}
            onChange={(e) => handleFileChange(e, "pdf")}
          />
        </div>
  
        {/* Prévisualisation du PDF */}
        <div style={{ marginTop: 32 }}>
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
            <p style={{ color: "lightgray", fontSize: 12 }}>
              <i>prévisualisation</i>
            </p>
            {previewPdfUrl ? (
              <iframe
                src={previewPdfUrl}
                style={{ width: 235, height: 270, backgroundColor: "#f3f3f3" }}
                title="PDF Preview"
              />
            ) : (
              <div style={{ width: 235, height: 270, backgroundColor: "#f3f3f3" }}></div>
            )}
          </div>
        </div>
  
        {/* Section pour uploader l'image de couverture */}
        <div style={{ marginTop: 32 }}>
          <p>Couverture du livre</p>
          <label
            htmlFor="image-upload"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              cursor: "pointer",
              backgroundColor: "#0cc0df",
              padding: "10px",
              borderRadius: "15px",
              transition: "background-color 0.2s",
              fontWeight: "500",
              width: 200,
              height: 47,
              marginTop: 8,
            }}
          >
            <Upload size={20} color="#fff" />
            <span style={{ color: "white", fontWeight: 14 }}>Charger couverture</span>
          </label>
          <input
            id="image-upload"
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={(e) => handleFileChange(e, "image")}
          />
        </div>
  
        {/* Prévisualisation de l'image de couverture */}
        <div style={{ marginTop: 32 }}>
          <div style={{ display: "flex", justifyContent: "center", flexDirection: "column" }}>
            <p style={{ color: "lightgray", fontSize: 12 }}>
              <i>prévisualisation</i>
            </p>
            {previewImageUrl ? (
              <img
                src={previewImageUrl}
                style={{ width: 74, height: 103, backgroundColor: "#f3f3f3" }}
                alt="Couverture du livre"
              />
            ) : (
              <div style={{ width: 74, height: 103, backgroundColor: "#f3f3f3" }}></div>
            )}
          </div>
        </div>
      </div>
    );
  };
  

// Composant PrixAuteur
const PrixAuteur = ({ livreData, handlePrixChange, setLivreData }) => {
    return (
      <div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div>
            <p style={{ fontSize: 14, maxWidth: 100 }}>Informations du livre</p>
          </div>
          <div>
            <p style={{ fontSize: 14, maxWidth: 100 }}>Contenu du livre</p>
          </div>
          <div>
            <p style={{ fontSize: 14, maxWidth: 100 }}>Prix & auteur du livre</p>
            <div
              style={{
                width: 36,
                height: 6,
                backgroundColor: "#0cc0df",
                borderRadius: 15,
              }}
            ></div>
          </div>
        </div>
        <div style={{ marginTop: 32 }}>
          <p>Auteur du livre</p>
          <input
            style={{ width: "100%", height: 47, backgroundColor: "#f3f3f3" }}
            value={livreData.auteur}
            onChange={(e) => setLivreData({ ...livreData, auteur: e.target.value })}
          />
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 32 }}>
            <div>
              <p>Prix du livre</p>
              <input
                style={{ width: "80%", height: 47, backgroundColor: "#f3f3f3" }}
                value={livreData.prix}
                onChange={handlePrixChange}
              />
            </div>
            <div>
              <p>Redevance</p>
              <input
                style={{ width: "80%", height: 47, backgroundColor: "#f3f3f3" }}
                value={livreData.redevance}
                readOnly
              />
            </div>
          </div>
        </div>
      </div>
    );
  };
export default CreateLivre;
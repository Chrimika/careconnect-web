"use client";
import { Pencil, Trash2, Plus, ChevronRight, ImportIcon, Upload } from "lucide-react";
import Header from "@/app/components/Header";
import { useState } from "react";
import Livre from '../models/Livre';
import { useRouter } from "next/navigation";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import Loader from "../components/LoaderPapers"

const CreateLivre = () => {
    const router = useRouter();
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
    const [isLoading, setIsLoading] = useState(false); // Pour gérer les loaders

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

    // Gestion de l'upload des fichiers (PDF et image)
    const handleFileChange = async (event, type) => {
        const file = event.target.files[0];
        if (file) {
            setIsLoading(true); // Activer le loader
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
                        pdfUrl: fileUrl,
                        contenuLivre: file,
                    }));
                    setPreviewPdfUrl(URL.createObjectURL(file)); // Prévisualisation locale
                } else if (type === "image") {
                    setLivreData((prevData) => ({
                        ...prevData,
                        coverUrl: fileUrl,
                        couvertureLivre: file,
                    }));
                    setPreviewImageUrl(URL.createObjectURL(file)); // Prévisualisation locale
                }
            } catch (error) {
                console.error(`Erreur lors de l'upload du fichier ${type} :`, error);
                alert(`Erreur lors de l'upload du fichier ${type}. Veuillez réessayer.`);
            } finally {
                setIsLoading(false); // Désactiver le loader
            }
        }
    };

    // Calcul de la redevance
    const handlePrixChange = (event) => {
        const prix = event.target.value;
        const redevance = prix * 0.7;
        setLivreData({ ...livreData, prix, redevance });
    };

    // Soumission du formulaire
    const handleSubmit = async () => {
        if (validateStep(3)) {
            setIsLoading(true); // Activer le loader
            try {
                // Créer une instance de la classe Livre
                const livre = new Livre(
                    null,
                    livreData.titre,
                    livreData.prix,
                    livreData.categorie,
                    [livreData.auteur],
                    livreData.couvertureLivre,
                    new Date().toISOString(),
                    0,
                    0,
                    0,
                    0,
                    livreData.contenuLivre,
                    livreData.sousTitre,
                    livreData.description,
                    "loading",
                    livreData.annee,
                    "Papers book",
                    livreData.format,
                    livreData.nombrePages
                );

                // Enregistrer le livre dans Firestore
                const result = await Livre.createLivre(livre);
                alert(result);
                router.push("../Livres");
            } catch (error) {
                console.error("Erreur lors de la soumission :", error);
                alert("Une erreur est survenue lors de la soumission. Veuillez réessayer.");
            } finally {
                setIsLoading(false); // Désactiver le loader
            }
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
                        isLoading={isLoading}
                    />
                );
            case 3:
                return <PrixAuteur livreData={livreData} handlePrixChange={handlePrixChange} setLivreData={setLivreData} />;
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
                        disabled={isLoading} // Désactiver le bouton pendant le chargement
                    >
                        {isLoading ? (
                            <p style={{ color: "#fff", fontWeight: "bold" }}>En cours...</p>
                        ) : (
                            <p style={{ color: "#fff", fontWeight: "bold" }}>Soumettre</p>
                        )}
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
        "Women's empowerment",
        "Personal development"
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
                                    marginTop: 7,
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
                            <p style={{ marginTop: 16 }}>Nbr pages</p>
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
                        style={{ width: "100%", height: 174, backgroundColor: "#f3f3f3", marginBottom: 15 }}
                        value={livreData.description}
                        onChange={(e) => handleChange("description", e.target.value)}
                    />
                </div>
            </div>
        </div>
    );
};

const ContenuLivre = ({ handleFileChange, previewPdfUrl, previewImageUrl, isLoading }) => {
    if (isLoading) {
        return (
            <div style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "rgba(255, 255, 255, 0.8)",
                zIndex: 9999,
            }}>
                <Loader color="#0cc0cd"/>
            </div>
        );
    }

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
                    disabled={isLoading} 
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
                    disabled={isLoading} 
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


const PrixAuteur = ({ livreData, handlePrixChange, setLivreData, isLoading }) => {
    // Si isLoading est true, afficher le Loader
    if (isLoading) {
        return <Loader color="#0cc0cd"/>;
    }

    // Sinon, afficher le contenu normal
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
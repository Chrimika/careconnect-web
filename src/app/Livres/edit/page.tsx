"use client";
import React, { useEffect, useState, Suspense } from "react";
import Livre from "../../models/Livre";
import { useRouter, useSearchParams } from "next/navigation";
import Loader from "../../components/Loader";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

interface LivreType {
  id: string;
  name: string;
  price: number;
  small_summary?: string;
  summary?: string;
  genre?: string;
  coverUrl?: string;
  verdict?: string;
  pdfUrl?: string;
  // Ajoute ici tous les champs nécessaires
}

const EditLivreInner = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const livreId = searchParams.get("id");
    const [livre, setLivre] = useState<LivreType | null>(null);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [previewPdfUrl, setPreviewPdfUrl] = useState<string | null>(null);
    const [newPdfFile, setNewPdfFile] = useState<File | null>(null);
    const [previewCoverUrl, setPreviewCoverUrl] = useState<string | null>(null);
    const [newCoverFile, setNewCoverFile] = useState<File | null>(null);

    useEffect(() => {
        const fetchLivre = async () => {
            const livres = await Livre.getLivresByAuteur(localStorage.getItem("id"));
            const found = livres.find((l: LivreType) => l.id === livreId) || null;
            setLivre(found);
            setLoading(false);
        };
        fetchLivre();
    }, [livreId]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (!livre || typeof livre !== "object") return;
        setLivre({ ...livre, [e.target.name]: e.target.value });
    };

    // Gestion de l'upload du PDF
    const handlePdfChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setUploading(true);
            setNewPdfFile(file);
            setPreviewPdfUrl(URL.createObjectURL(file));
            setUploading(false);
        }
    };

    // Gestion de l'upload de la couverture
    const handleCoverChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setUploading(true);
            setNewCoverFile(file);
            setPreviewCoverUrl(URL.createObjectURL(file));
            setUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!livre) return;
        setUploading(true);

        const updatedLivre: LivreType = { ...livre, verdict: "loading" };

        // Upload nouvelle couverture si modifiée
        if (newCoverFile) {
            try {
                const storage = getStorage();
                const coverRef = ref(storage, `covers/${newCoverFile.name}`);
                await uploadBytes(coverRef, newCoverFile);
                const coverUrl = await getDownloadURL(coverRef);
                updatedLivre.coverUrl = coverUrl;
            } catch {
                alert("Erreur lors de l'upload de la couverture.");
                setUploading(false);
                return;
            }
        }

        // Upload nouveau PDF si modifié
        if (newPdfFile) {
            try {
                const storage = getStorage();
                const pdfRef = ref(storage, `pdfs/${newPdfFile.name}`);
                await uploadBytes(pdfRef, newPdfFile);
                const pdfUrl = await getDownloadURL(pdfRef);
                updatedLivre.pdfUrl = pdfUrl;
            } catch {
                alert("Erreur lors de l'upload du nouveau PDF.");
                setUploading(false);
                return;
            }
        }

        const res = await Livre.updateLivre(livreId, updatedLivre);
        setUploading(false);
        alert(`${res}\nVos modifications ont été prises en compte. Papers validera ces mises à jour en moins de 24hr, merci...`);
        router.push("/Livres");
    };

    if (loading || uploading) return <Loader />;
    if (!livre) return <div>Livre introuvable.</div>;

    return (
        <div style={{ maxWidth: 1000, margin: "40px auto", padding: 24, background: "#fff", borderRadius: 12 }}>
            <h2 style={{ fontSize: 24, marginBottom: 16 }}>Modifier le livre</h2>
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: 12 }}>
                    <label>Titre</label>
                    <input
                        name="name"
                        value={livre.name}
                        onChange={handleChange}
                        style={{ width: "100%", padding: 8, borderRadius: 6, border: "1px solid #ccc" }}
                        required
                    />
                </div>
                <div style={{ marginBottom: 12 }}>
                    <label>Prix</label>
                    <input
                        name="price"
                        type="number"
                        value={livre.price}
                        onChange={handleChange}
                        style={{ width: "100%", padding: 8, borderRadius: 6, border: "1px solid #ccc" }}
                        required
                    />
                </div>
                <div style={{ marginBottom: 12 }}>
                    <label>Résumé court</label>
                    <textarea
                        name="small_summary"
                        value={livre.small_summary || ""}
                        onChange={handleChange}
                        style={{ width: "100%", padding: 8, borderRadius: 6, border: "1px solid #ccc" }}
                    />
                </div>
                {/* Section pour uploader la couverture */}
                <div style={{ marginBottom: 12 }}>
                    <label>Couverture du livre</label>
                    <label
                        htmlFor="cover-upload"
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                            cursor: "pointer",
                            backgroundColor: "#0cc0df",
                            padding: "10px",
                            borderRadius: "15px",
                            fontWeight: "500",
                            width: 177,
                            height: 47,
                            marginTop: 8,
                        }}
                    >
                        <span style={{ color: "white", fontWeight: 14 }}>Importer une couverture</span>
                    </label>
                    <input
                        id="cover-upload"
                        type="file"
                        accept="image/*"
                        style={{ display: "none" }}
                        onChange={handleCoverChange}
                    />
                    {/* Prévisualisation de la couverture */}
                    <div style={{ marginTop: 12 }}>
                        <p style={{ color: "lightgray", fontSize: 12 }}>
                            <i>prévisualisation</i>
                        </p>
                        {previewCoverUrl ? (
                            <img
                                src={previewCoverUrl}
                                alt="Preview Couverture"
                                style={{ width: 120, height: 170, objectFit: "cover", backgroundColor: "#f3f3f3", borderRadius: 8 }}
                            />
                        ) : (
                            livre.coverUrl ? (
                                <img
                                    src={livre.coverUrl}
                                    alt="Couverture"
                                    style={{ width: 120, height: 170, objectFit: "cover", backgroundColor: "#f3f3f3", borderRadius: 8 }}
                            />
                        ) : (
                            <div style={{ width: 120, height: 170, backgroundColor: "#f3f3f3", borderRadius: 8 }}></div>
                        )
                        )}
                    </div>
                </div>
                {/* Section pour uploader le PDF */}
                <div style={{ marginBottom: 12 }}>
                    <label>Contenu du livre (PDF)</label>
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
                            fontWeight: "500",
                            width: 177,
                            height: 47,
                            marginTop: 8,
                        }}
                    >
                        <span style={{ color: "white", fontWeight: 14 }}>Importer un livre</span>
                    </label>
                    <input
                        id="pdf-upload"
                        type="file"
                        accept="application/pdf"
                        style={{ display: "none" }}
                        onChange={handlePdfChange}
                    />
                    {/* Prévisualisation du PDF */}
                    <div style={{ marginTop: 12 }}>
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
                            livre.pdfUrl ? (
                                <iframe
                                    src={livre.pdfUrl}
                                    style={{ width: 235, height: 270, backgroundColor: "#f3f3f3" }}
                                    title="PDF Preview"
                                />
                            ) : (
                                <div style={{ width: 235, height: 270, backgroundColor: "#f3f3f3" }}></div>
                            )
                        )}
                    </div>
                </div>
                <button
                    type="submit"
                    style={{
                        background: "#0cc0DF",
                        color: "#fff",
                        padding: "10px 24px",
                        border: "none",
                        borderRadius: 8,
                        fontSize: 16,
                        cursor: "pointer",
                        marginTop: 8
                    }}
                >
                    Enregistrer
                </button>
            </form>
        </div>
    );
};

const EditLivre = () => (
    <Suspense fallback={<Loader />}>
        <EditLivreInner />
    </Suspense>
);

export default EditLivre;
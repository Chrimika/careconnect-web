"use client";
import React, { useState, useEffect } from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";
import Image from "next/image";
import user from "../assets/images/user.png";
import { LogOut, Info, Lock, ChevronRight } from "lucide-react";
import Link from "next/link";
import UserAuteur from "../models/UserAuteur";

const Profile = () => {
  const [auteur, setAuteur] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({});
  const [photoPreview, setPhotoPreview] = useState(null);
  const [newPhoto, setNewPhoto] = useState(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const id = localStorage.getItem("id");
    if (!id) return;
    UserAuteur.getById(id).then((auteur) => {
      setAuteur(auteur);
      setEditData({
        nom: auteur.nom,
        metier: auteur.metier,
        tel: auteur.tel,
        ville: auteur.ville,
        email: auteur.email,
        photo: auteur.photo,
      });
    });
  }, []);

  const handleEditChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewPhoto(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleSaveProfile = async () => {
    if (!auteur) return;
    setIsSaving(true);
    if (newPhoto) {
      await auteur.updatePhoto(newPhoto);
    }
    await auteur.updateProfile(editData);
    setEditMode(false);
    setIsSaving(false);
    setPhotoPreview(null);
    setNewPhoto(null);
    setAuteur({ ...auteur, ...editData });
    alert("Profil mis à jour !");
  };

  const handleChangePassword = async () => {
    if (!auteur || !newPassword) return;
    setIsSaving(true);
    await auteur.changePassword(newPassword);
    setShowPasswordModal(false);
    setIsSaving(false);
    setNewPassword("");
    alert("Mot de passe mis à jour !");
  };

  return (
    <div
      style={{
        margin: 0,
        padding: "0 16px",
        flex: 1,
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <style>
        {`
          div::-webkit-scrollbar {
            display: none;
          }
        `}
      </style>
      <div style={{ flex: 0.8, overflowY: "scroll", height: "100vh", maxWidth: 1000, width: "100%", padding: 16 }}>
        <Header title="Profile" subTitle="" />
        <div style={{ marginTop: 32 }}>
          <Image
            src={photoPreview || (auteur?.photo?.startsWith("http") ? auteur.photo : user)}
            alt="Logo"
            width={150}
            height={150}
            style={{ borderRadius: 75, margin: "0 auto" }}
          />
          <div style={{ marginTop: 8, textAlign: "center" }}>
            <label htmlFor="photo-upload" style={{ cursor: "pointer", color: "#0cc0cd", fontWeight: "bold" }}>
              Modifier la photo
            </label>
            <input id="photo-upload" type="file" accept="image/*" style={{ display: "none" }} onChange={handlePhotoChange} />
          </div>
        </div>

        <div style={{ marginTop: 32 }}>
          {editMode ? (
            <>
              <input name="nom" value={editData.nom || ""} onChange={handleEditChange} placeholder="Nom"
                style={{ width: "100%", marginBottom: 8, color: "#000", background: "#fff", border: "1px solid #ccc", borderRadius: 6, padding: 8 }} />
              <input name="metier" value={editData.metier || ""} onChange={handleEditChange} placeholder="Métier"
                style={{ width: "100%", marginBottom: 8, color: "#000", background: "#fff", border: "1px solid #ccc", borderRadius: 6, padding: 8 }} />
              <input name="tel" value={editData.tel || ""} onChange={handleEditChange} placeholder="Téléphone"
                style={{ width: "100%", marginBottom: 8, color: "#000", background: "#fff", border: "1px solid #ccc", borderRadius: 6, padding: 8 }} />
              <input name="ville" value={editData.ville || ""} onChange={handleEditChange} placeholder="Ville"
                style={{ width: "100%", marginBottom: 8, color: "#000", background: "#fff", border: "1px solid #ccc", borderRadius: 6, padding: 8 }} />
              <button style={{ background: "#0cc0cd", color: "#fff", borderRadius: 8, padding: "8px 24px", marginTop: 8 }} onClick={handleSaveProfile}>
                Enregistrer
              </button>
              <button style={{ background: "#ccc", color: "#000", borderRadius: 8, padding: "8px 24px", marginTop: 8, marginLeft: 8 }} onClick={() => setEditMode(false)}>
                Annuler
              </button>
            </>
          ) : (
            <>
              <p style={{ textAlign: "center", fontSize: 13, fontWeight: "bold" }}>{auteur?.nom}</p>
              <p style={{ textAlign: "center", fontSize: 12, color: "gray" }}>{auteur?.metier}</p>
              <button style={{ background: "#0cc0cd", color: "#fff", borderRadius: 8, padding: "8px 24px", marginTop: 8 }} onClick={() => setEditMode(true)}>
                Modifier
              </button>
            </>
          )}
        </div>

        <div style={{ width: "100%", height: 199, backgroundColor: "#f9f9f9", borderRadius: 15, marginTop: 32, display: "flex", flexDirection: "column" }}>
          <div style={{ flex: 1, width: "100%", borderBottomColor: "#fff", borderBottomWidth: 2, display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 32px" }}>
            <p>Email</p>
            <p>{auteur?.email}</p>
            <p><ChevronRight size={24} color="#000" /></p>
          </div>
          <div style={{ flex: 1, width: "100%", borderBottomColor: "#fff", borderBottomWidth: 2, display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 32px" }}>
            <p>Tel</p>
            <p>{auteur?.tel}</p>
            <p><ChevronRight size={24} color="#000" /></p>
          </div>
          <div style={{ flex: 1, width: "100%", borderBottomColor: "#fff", borderBottomWidth: 2, display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 32px" }}>
            <p>Address</p>
            <p>{auteur?.ville}</p>
            <p><ChevronRight size={24} color="#000" /></p>
          </div>
        </div>

        <div style={{ width: "100%", height: 199, backgroundColor: "#f9f9f9", borderRadius: 15, marginTop: 32, display: "flex", flexDirection: "column" ,cursor: "pointer"}}>
          <div onClick={() => setShowPasswordModal(true)} style={{ flex: 1, width: "100%", borderBottomColor: "#fff", borderBottomWidth: 2, display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 32px" }}>
            <p>Changer mot de passe</p>
            <p><Lock size={24} color="#000"  style={{  }} /></p>
          </div>
          <div style={{ flex: 1, width: "100%", borderBottomColor: "#fff", borderBottomWidth: 2, display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 32px" }}>
            <p>Help</p>
            <p><Info size={24} color="#000" /></p>
          </div>
          <Link style={{ flex: 1, width: "100%", borderBottomColor: "#fff", borderBottomWidth: 2, display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 32px" }} href="../">
            <p style={{ color: "red" }}>Logout</p>
            <p><LogOut size={24} color="red" /></p>
          </Link>
        </div>

        {showPasswordModal && (
          <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", backgroundColor: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center" }}>
            <div style={{ background: "#fff", padding: 24, borderRadius: 12, width: 320 }}>
              <h3 style={{ color: "#000" }}>Changer le mot de passe</h3>
              <input type="text" placeholder="Nouveau mot de passe" value={newPassword} onChange={e => setNewPassword(e.target.value)}
                style={{ width: "100%", marginBottom: 12, color: "#000", background: "#fff", border: "1px solid #ccc", borderRadius: 6, padding: 8 }} />
              <button style={{ background: "#0cc0cd", color: "#fff", borderRadius: 8, padding: "8px 24px", marginRight: 8 }} onClick={handleChangePassword}>
                Enregistrer
              </button>
              <button style={{ background: "#ccc", color: "#000", borderRadius: 8, padding: "8px 24px" }} onClick={() => setShowPasswordModal(false)}>
                Annuler
              </button>
            </div>
          </div>
        )}
      </div>
      <Footer active={"user"} />
    </div>
  );
};

export default Profile;

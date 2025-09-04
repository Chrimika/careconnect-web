"use client"; // Indique que ce composant est côté client
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { collection, query, where, getDocs } from "firebase/firestore";
import { firestore } from "./firebase"; // Assurez-vous que ce chemin est correct
import CryptoJS from "crypto-js"; // Pour le hachage du mot de passe
import styles from "./Login.module.css"; // Créez un fichier CSS pour les styles
import logo from "./assets/images/logo.jpg"
import Image from "next/image"

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();

    // Fonction pour hacher le mot de passe
    const hashPassword = (password) => {
        return CryptoJS.SHA256(password).toString();
    };

    // Fonction pour gérer la connexion
    const handleLogin = async () => {
        if (!email || !password) {
            setErrorMessage("Veuillez remplir tous les champs.");
            return;
        }

        setIsLoading(true);
        setErrorMessage("");

        // Vérification du compte staff validator
        if (
            email === "Papers_Staff_Validators" &&
            password === "Papers237**??"
        ) {
            localStorage.setItem("isValidator", "true");
            router.push("/Validators/");
            setIsLoading(false);
            return;
        }

        try {
            const hashedPassword = hashPassword(password);

            // Requête pour vérifier les informations de connexion
            const q = query(
                collection(firestore, "auteurs"),
                where("email", "==", email),
                where("password", "==", hashedPassword)
            );

            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                const authorDoc = querySnapshot.docs[0];
                const authorData = authorDoc.data();

                // Stocker les informations dans le localStorage
                localStorage.setItem("email", authorData.email);
                localStorage.setItem("password", password);
                localStorage.setItem("id", authorDoc.id);
                localStorage.setItem("name", authorData.NomPrenom);
                localStorage.setItem("metier", authorData.metier);
                localStorage.setItem("tel", authorData.tel);
                localStorage.setItem("ville", authorData.ville);
                localStorage.setItem("photo", authorData.photo);
                localStorage.setItem("solde", authorData.solde);


                // Rediriger vers la page Livres
                router.push("/Livres");
            } else {
                setErrorMessage("Email ou mot de passe incorrect.");
            }
        } catch (error) {
            console.error("Erreur lors de la connexion:", error);
            setErrorMessage("Une erreur est survenue. Veuillez réessayer plus tard.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.loginContainer}>
            <Image src={logo} alt="Logo" style={{margin:'0 auto'}} className={styles.logo} />
            <h5>Se connecter</h5>
            <p><i style={{ color: "brown" }}>Papers Authors</i></p>

            <div className={styles.inputField}>
                <input
                    id="email"
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
            </div>

            <div className={styles.inputField} style={{ position: "relative" }}>
                <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Mot de passe"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <span
                    className={styles.eyeIcon}
                    onClick={() => setShowPassword(!showPassword)}
                >
                    {showPassword ? "visibility" : "visibility_off"}
                </span>
            </div>

            <button
                id="login-btn"
                className={styles.loginButton}
                style={{backgroundColor:'#0cc0cd'}}
                onClick={handleLogin}
                disabled={isLoading}
            >
                {isLoading ? "Connexion en cours..." : "Se connecter"}
            </button>

            {isLoading && (
                <div className={styles.loader}>
                    <div className={styles.spinner}></div>
                </div>
            )}

            {errorMessage && (
                <div id="error-message" className={styles.errorMessage}>
                    {errorMessage}
                </div>
            )}
        </div>
    );
};

export default Login;
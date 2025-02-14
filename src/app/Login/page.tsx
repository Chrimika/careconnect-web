"use client"

import React, { useState } from 'react';
import { useRouter } from "next/navigation";
import { IoEyeOffOutline, IoEyeOutline } from 'react-icons/io5';
import logo from "../assets/images/logo.png";
import Image from "next/image";

export default function LoginScreen() {
  const [password, setPassword] = useState('');
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const router = useRouter();

  return (
    <div className="login-screen" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor:'#087a5d' }}>
      <div className="status-bar" style={{ backgroundColor: '#087a5d', width: '100%',}}></div>

      <div className="header" style={{ backgroundColor: '#087a5d', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Image src={logo} alt="Logo" style={{ width: 48, height: 48, borderRadius: 24, margin: '10px 0'  }} />
      </div>

      <div className="container" style={{ flex: 1, backgroundColor: '#0bcb95', borderTopLeftRadius: 37, borderTopRightRadius: 37, width: '100%' }}>
        <div className="header-text" style={{ padding: '16px', textAlign: 'center', color: 'white' }}>
          <h2 style={{ fontFamily: 'Rubik Medium', fontSize: '24px' }}>Créez un compte</h2>
          <p style={{ fontFamily: 'Poppins Medium', fontSize: '12px' }}>Connectez-vous et recevez des soins chez vous</p>
        </div>

        <div className="form-container" style={{ backgroundColor: 'white', borderTopLeftRadius: 37, borderTopRightRadius: 37, padding: 32, width: '100%' }}>
          <div className="input-group" style={{ marginBottom: 24 }}>
            <label style={{ fontSize: 12, fontFamily: 'Poppins Medium', marginBottom: 8, display: 'block' }}>Nom complet</label>
            <input
              type="text"
              placeholder="Mika MBA"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              style={{ width: '100%', height: 45, backgroundColor: '#f3f3f3', border: 'none', padding: '8px', borderRadius: 8 }}
            />
          </div>

          <div className="input-group" style={{ marginBottom: 24 }}>
            <label style={{ fontSize: 12, fontFamily: 'Poppins Medium', marginBottom: 8, display: 'block' }}>Email</label>
            <input
              type="email"
              placeholder="example@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ width: '100%', height: 45, backgroundColor: '#f3f3f3', border: 'none', padding: '8px', borderRadius: 8 }}
            />
          </div>

          <div className="input-group" style={{ marginBottom: 24 }}>
            <label style={{ fontSize: 12, fontFamily: 'Poppins Medium', marginBottom: 8, display: 'block' }}>Mot de passe</label>
            <div style={{ display: 'flex', alignItems: 'center', backgroundColor: '#f3f3f3', borderRadius: 8 }}>
              <input
                type={secureTextEntry ? 'password' : 'text'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ flex: 1, height: 45, padding: '8px', border: 'none', borderRadius: 8, backgroundColor: '#f3f3f3' }}
              />
              <button
                onClick={() => setSecureTextEntry(!secureTextEntry)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '8px' }}
              >
                {secureTextEntry ? (
                  <IoEyeOffOutline size={20} color="gray" />
                ) : (
                  <IoEyeOutline size={20} color="gray" />
                )}
              </button>
            </div>
          </div>
          <div style={{height:200, borderWidth:1}}></div>
          <button
            style={{ width: '100%', height: 45, backgroundColor: '#0bcb95', color: 'white', border: 'none', borderRadius: 8, fontSize: 18, fontFamily: 'Rubik Medium', cursor: 'pointer' }}
          >
            Se connecter
          </button>

          <div className="footer-text" style={{ marginTop: 16, textAlign: 'center' }}>
            <p style={{ fontSize: 14, fontFamily: 'Rubik Medium', color: 'black' }}>
              Pas encore de compte ?{' '}
              <span
                onClick={() => router.push("../")}
                style={{ color: '#0bcb95', textDecoration: 'underline', cursor: 'pointer' }}
              >
                Sign up
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

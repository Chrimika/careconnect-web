"use client";
import React from "react";
import { useState, useEffect } from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";
import Image from "next/image";
import user from "../assets/images/user.png";
import { LogOut, Info, Lock, ChevronRight } from "lucide-react";
import Link from "next/link";
import { vi } from "date-fns/locale";


const Profile = () => {

  const [auteurId, setAuteurId] = useState(null); 
  const [email, setEmail] = useState(null);
  const [tel, setTel] = useState(null); 
  const [ville, setVille] = useState(null); 
  const [metier, setMetier] = useState(null); 
  const [nom, setNom] = useState(null); 
  const [photo, setPhoto] = useState(null); 

  useEffect(() => {
      const id = localStorage.getItem("id");
      const email = localStorage.getItem("email");
      const tel = localStorage.getItem("tel");
      const ville = localStorage.getItem("ville");
      const metier = localStorage.getItem("metier");
      const nom = localStorage.getItem("name");
      const photo = localStorage.getItem("photo");

      setAuteurId(id);
      setEmail(email);
      setMetier(metier);
      setTel(tel);
      setVille(ville);
      setNom(nom);
      setPhoto(photo);
  }, []);

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
        width: "100%",
      }}
    >
      <style>
          {`
              div::-webkit-scrollbar {
                  display: none;
              }
          `}
      </style>
      <div style={{ flex: 0.8, overflowY: "scroll",height:'100%'  }}>
        <Header title="Profile" subTitle="" />
        <div style={{ marginTop: 32 }}>
          {/* Utilisation correcte de next/image */}
          <Image
            src={photo?.startsWith("http") ? photo : user}
            alt="Logo"
            width={150}
            height={150}
            style={{ borderRadius: 75, margin: '0 auto' }}
          />

        </div>

        <div style={{marginTop:32}}>
          <p style={{textAlign:'center',fontSize:13,fontWeight:'bold'}}>{nom}</p>
          <p style={{textAlign:'center',fontSize:12,color:'gray'}}>{metier}</p>
        </div>

        <div style={{width:'100%', height:199, backgroundColor:'#f9f9f9',borderRadius:15, marginTop:32, display:'flex', flexDirection:'column'}}>
            <div style={{flex:1,width:'100%',borderBottomColor:'#fff',borderBottomWidth:2,display:'flex',justifyContent:'space-between',alignItems:'center',padding:'0 32px'}}>
                <p>Email</p>
                <p>{email}</p>
                <p><ChevronRight size={24}/></p>
            </div>
            <div style={{flex:1,width:'100%',borderBottomColor:'#fff',borderBottomWidth:2,display:'flex',justifyContent:'space-between',alignItems:'center',padding:'0 32px'}}>
                <p>Tel</p>
                <p>{tel}</p>
                <p><ChevronRight size={24}/></p>
            </div>
            <div style={{flex:1,width:'100%',borderBottomColor:'#fff',borderBottomWidth:2,display:'flex',justifyContent:'space-between',alignItems:'center',padding:'0 32px'}}>
                <p>Address</p>
                <p>{ville}</p>
                <p><ChevronRight size={24}/></p>
            </div>
        </div>

        <div style={{width:'100%', height:199, backgroundColor:'#f9f9f9',borderRadius:15, marginTop:32, display:'flex', flexDirection:'column'}}>
            <div style={{flex:1,width:'100%',borderBottomColor:'#fff',borderBottomWidth:2,display:'flex',justifyContent:'space-between',alignItems:'center',padding:'0 32px'}}>
                <p>Changer mot de passe</p>
                <p><Lock size={24}/></p>
            </div>
            <div style={{flex:1,width:'100%',borderBottomColor:'#fff',borderBottomWidth:2,display:'flex',justifyContent:'space-between',alignItems:'center',padding:'0 32px'}}>
                <p>Help</p>
                <p><Info size={24}/></p>
            </div>

            <Link style={{flex:1,width:'100%',borderBottomColor:'#fff',borderBottomWidth:2,display:'flex',justifyContent:'space-between',alignItems:'center',padding:'0 32px'}} href="../">
              
                  <p style={{color:'red'}}>Logout</p>
                  <p><LogOut size={24} color="red"/></p>
              
            </Link>
            
        </div>
      </div>
      <Footer active={"user"} />
    </div>
  );
};

export default Profile;

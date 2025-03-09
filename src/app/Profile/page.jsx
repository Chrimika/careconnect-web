"use client";
import React from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";
import Image from "next/image";
import user from "../assets/images/user.png";
import { LogOut, Info, Lock, ChevronRight } from "lucide-react";



const Profile = () => {
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
      <div style={{ flex: 0.9 }}>
        <Header title="Profile" subTitle="" />
        <div style={{ marginTop: 32 }}>
          {/* Utilisation correcte de next/image */}
          <Image
            src={user}
            alt="Logo"
            width={150}
            height={150}
            style={{borderRadius:75,margin:'0 auto'}}
            priority // optionnel, permet de prioriser le chargement de l'image
          />
        </div>

        <div style={{marginTop:32}}>
          <p style={{textAlign:'center',fontSize:13,fontWeight:'bold'}}>Mika MBA</p>
          <p style={{textAlign:'center',fontSize:12,color:'gray'}}>Developpeur mobile</p>
        </div>

        <div style={{width:379, height:199, backgroundColor:'#f9f9f9',borderRadius:15, marginTop:32, display:'flex', flexDirection:'column'}}>
            <div style={{flex:1,width:'100%',borderBottomColor:'#fff',borderBottomWidth:2,display:'flex',justifyContent:'space-between',alignItems:'center',padding:'0 32px'}}>
                <p>Email</p>
                <p>mbachristian58@gmail.com</p>
                <p><ChevronRight size={24}/></p>
            </div>
            <div style={{flex:1,width:'100%',borderBottomColor:'#fff',borderBottomWidth:2,display:'flex',justifyContent:'space-between',alignItems:'center',padding:'0 32px'}}>
                <p>Tel</p>
                <p>+237 672 094 167</p>
                <p><ChevronRight size={24}/></p>
            </div>
            <div style={{flex:1,width:'100%',borderBottomColor:'#fff',borderBottomWidth:2,display:'flex',justifyContent:'space-between',alignItems:'center',padding:'0 32px'}}>
                <p>Address</p>
                <p>Yaounde, Damas</p>
                <p><ChevronRight size={24}/></p>
            </div>
        </div>

        <div style={{width:379, height:199, backgroundColor:'#f9f9f9',borderRadius:15, marginTop:32, display:'flex', flexDirection:'column'}}>
            <div style={{flex:1,width:'100%',borderBottomColor:'#fff',borderBottomWidth:2,display:'flex',justifyContent:'space-between',alignItems:'center',padding:'0 32px'}}>
                <p>Changer mot de passe</p>
                <p><Lock size={24}/></p>
            </div>
            <div style={{flex:1,width:'100%',borderBottomColor:'#fff',borderBottomWidth:2,display:'flex',justifyContent:'space-between',alignItems:'center',padding:'0 32px'}}>
                <p>Help</p>
                <p><Info size={24}/></p>
            </div>
            <div style={{flex:1,width:'100%',borderBottomColor:'#fff',borderBottomWidth:2,display:'flex',justifyContent:'space-between',alignItems:'center',padding:'0 32px'}}>
                <p style={{color:'red'}}>Logout</p>
                <p><LogOut size={24} color="red"/></p>
            </div>
        </div>
      </div>
      <Footer active={"user"} />
    </div>
  );
};

export default Profile;

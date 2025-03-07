"use client";
import React from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";

const Profile = () => {
    return(
        <div style={{margin: '0 auto',padding:'48px 16px',flex:1,height:'100vh',display:'flex',flexDirection:'column',maxWidth:"70%",justifyContent:'center',alignItems:'center'}}>
            <div style={{flex:0.9,border:'1px solid black'}}>
                <Header title="Profile" subTitle=""/>
                
            </div>
            <Footer active={"user"} />
        </div>
    )
}

export default Profile;
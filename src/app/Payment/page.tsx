"use client";
import React from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";

const Payment = () => {
    return(
        <div style={{margin: 0,padding:'48px 16px',flex:1,height:'100vh',display:'flex',flexDirection:'column'}}>
            <div style={{flex:0.9,border:'1px solid black'}}>
                <Header title="Paiements" subTitle=""/>
                
            </div>
            <Footer active={"wallet"} />
        </div>
        
    )
}

export default Payment;
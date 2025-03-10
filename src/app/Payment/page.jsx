"use client";
import React from "react";
import { useState } from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";
import Image from "next/image";
import deposite from "../assets/images/deposit.png"
import withdrawal from "../assets/images/withdrawal.png"
import depositeBig from "../assets/images/depositBig.png"

const Payment = () => {
    const [progress, setProgress] = useState(50);

    return(
        <div style={{margin: '0 auto',padding:'0 16px',flex:1,height:'100vh',display:'flex',flexDirection:'column',justifyContent:'center'}}>
            <style>
                {`
                    div::-webkit-scrollbar {
                        display: none;
                    }
                `}
            </style>
            <div style={{flex:0.8,overflowY: "scroll"}}>
                <Header title="Paiements" subTitle=""/>
                <div style={{flex:0.4,width:'100%', height:180, backgroundColor:'#f9f9f9',borderRadius:15, marginTop:32, display:'flex', flexDirection:'column'}}>
                    <div style={{flex:1,width:'100%',display:'flex',justifyContent:'space-between',alignItems:'center',padding:'0 32px'}}>
                        <p style={{fontSize:14}}>Vos revenus</p>
                        <p style={{fontSize:24,fontWeight:'lighter'}}>92,000<span style={{fontSize:15}}>XAF</span></p>
                    </div>
                    <div
                        style={{
                            height: "8px",
                            backgroundColor: "#E0E0E0",
                            borderRadius: "4px",
                            overflow: "hidden",
                            position: "relative",
                            margin:'0 32px'
                        }}
                        >
                        <div
                            style={{
                            width: `${progress}%`, // Barre dynamique
                            height: '8px',
                            backgroundColor: "#0CC0DF",
                            borderRadius: "4px",
                            }}
                        ></div>
                    </div>

                    <div style={{flex:1,width:'100%',display:'flex',justifyContent:'space-between',padding:'0 32px'}}>
                        <p style={{fontSize:7}}>Vous avez atteint 0.00% de votre seuil de paiement</p>
                        <div style={{display:'flex',flexDirection:'column'}}>
                            <p style={{fontSize:7}}>Seuil de paiement: <span style={{fontWeight:'bold',fontSize:10,color:'#0CC0DF'}}>20,000 XAF</span></p>
                            <button style={{width:80,height:30,backgroundColor:'#0cc0dc',borderRadius:15,marginTop:8,marginLeft:'auto'}}>
                                <p style={{fontSize:10,color:'#fff'}}>Retirer</p>
                            </button>
                        </div>
                    </div>
                </div>

                <div style={{flex:0.6,width:'100%', height:300, backgroundColor:'#f9f9f9',borderRadius:15, marginTop:32, display:'flex', flexDirection:'column'}}>
                    <div style={{flex:0.5,width:'100%',display:'flex',justifyContent:'space-between',alignItems:'center',padding:'0 32px'}}>
                        <p style={{fontSize:16}}>Transactions</p>
                    </div>
                    <div style={{flex:2,width:'100%',display:'flex',justifyContent:'space-between',padding:'0 32px'}}>
                        <div style={{width:'100%'}}>
                            <p style={{fontSize:12,color:'gray',fontWeight:'bold'}}>Lundi, 15 nov</p>
                            <div style={{marginTop:8,display:'flex',justifyContent:'space-between',width:'100%',borderBottomWidth:1,borderBottomColor:'lightgray',padding:'6px 0'}}>
                                <div style={{display:'flex', alignItems:'center'}}>
                                    <Image
                                        src={withdrawal}
                                        alt="yo"
                                        width={40}
                                        height={10}
                                    />
                                    <div style={{marginLeft:8}}>
                                        <p style={{fontSize:14,fontWeight:'bold',color:'#0cc0cd'}}>Papers</p>
                                        <p style={{fontSize:9}}>Retrait dargent</p>
                                    </div>
                                </div>
                                <div style={{display:'flex',flexDirection:'column'}}>
                                    <p style={{color:'red',fontWeight:'bold'}}>-23000 FCFA</p>
                                    <p style={{fontSize:14,marginLeft:'auto',}}>15:13</p>
                                </div>
                            </div>

                            <div style={{marginTop:8,display:'flex',justifyContent:'space-between',width:'100%',borderBottomWidth:1,borderBottomColor:'lightgray',padding:'6px 0'}}>
                                <div style={{display:'flex', alignItems:'center'}}>
                                    <Image
                                        src={deposite}
                                        alt="yo"
                                        width={40}
                                        height={10}
                                    />
                                    <div style={{marginLeft:8}}>
                                        <p style={{fontSize:14,fontWeight:'bold',color:'#0cc0cd'}}>Papers</p>
                                        <p style={{fontSize:9}}>Depot dargent</p>
                                    </div>
                                </div>
                                <div style={{display:'flex',flexDirection:'column'}}>
                                    <p style={{color:'lightgreen',fontWeight:'bold'}}>+1300 FCFA</p>
                                    <p style={{fontSize:14,marginLeft:'auto',}}>02:13</p>
                                </div>
                            </div>

                            <div style={{marginTop:8,display:'flex',justifyContent:'space-between',width:'100%',borderBottomWidth:1,borderBottomColor:'lightgray',padding:'6px 0'}}>
                                <div style={{display:'flex', alignItems:'center'}}>
                                    <Image
                                        src={withdrawal}
                                        alt="yo"
                                        width={40}
                                        height={10}
                                    />
                                    <div style={{marginLeft:8}}>
                                        <p style={{fontSize:14,fontWeight:'bold',color:'#0cc0cd'}}>Papers</p>
                                        <p style={{fontSize:9}}>Retrait dargent</p>
                                    </div>
                                </div>
                                <div style={{display:'flex',flexDirection:'column'}}>
                                    <p style={{color:'red',fontWeight:'bold'}}>-10000 FCFA</p>
                                    <p style={{fontSize:14,marginLeft:'auto',}}>17:13</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div style={{flex:0.3,width:'100%', height:150, backgroundColor:'#f9f9f9',borderRadius:15, marginTop:32, display:'flex', flexDirection:'column'}}>
                    <div style={{flex:1,display:'flex',justifyContent:'space-between',padding:'16px 16px'}}>
                        <Image
                            src={depositeBig}
                            alt="deposite"
                            style={{width:60,height:60}}
                        />
                        <div>
                            <p style={{fontWeight:'bold'}}>MTN MOMO</p>
                            <p>----------</p>
                        </div>
                        <div>
                            <p style={{fontWeight:'bold'}}>Orange Money</p>
                            <p>----------</p>
                        </div>
                    </div>
                    <div style={{flex:1,display:'flex',}}>
                        <button style={{width:80,height:30,backgroundColor:'#0cc0dc',borderRadius:15,marginTop:8,margin:'0 auto'}}>
                            <p style={{fontSize:10,color:'#fff'}}>Parametrer</p>
                        </button>
                    </div>
                </div>
                
            </div>
            <Footer active={"wallet"} />
        </div>
        
    )
}

export default Payment;
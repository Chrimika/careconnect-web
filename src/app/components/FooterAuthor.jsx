"use client"

import { useRouter } from "next/navigation";
import React from 'react';

const Footer = () => {
    return(
        <div style={{
            position:'fixed',
            bottom: 20,
            left: 0,
            width: '100%',
            zIndex: 1000}}>
                <div style={{display: 'flex',
                            backgroundColor: '#F3F3F3',
                            width: '100%',
                            maxWidth: 1000,
                            margin: '0 auto',
                            height: 60,
                            alignItems: 'center',
                            justifyContent:'space-around',
                            borderRadius: 20}}>
                            
                </div>
        </div>
    )
}
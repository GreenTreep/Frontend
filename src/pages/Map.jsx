import React from 'react'
import { Link } from 'react-router-dom'
import '../index.css';
import { Icon } from '@iconify/react';
import HeroSection from '../components/ui/HeroSection.jsx';
import MapPage from '../components/ui/MapBoxMap.jsx';

function Test() {
    return (
        <>
            <HeroSection />
            <MapPage />

        </>
    )
}

export default Test
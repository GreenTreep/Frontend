import React from 'react'
import { Link } from 'react-router-dom'
import '../index.css';
import { Icon } from '@iconify/react';
import HeroSection from '../components/ui/HeroSection.jsx';
import MapPage from '../components/ui/MapBoxMap.jsx';

function Map() {
    return (
        <>
            <Link to="/"> <Icon icon="material-symbols:arrow-back" width="24" height="24"/></Link>

            {/*<HeroSection />*/}
            <MapPage />

        </>
    )
}

export default Map
import React from 'react'
import { Link } from 'react-router-dom'
import '../index.css';

import HeroSection from '../components/ui/HeroSection.jsx';
import MapSection from '../components/ui/MapSection';

function Test() {
  return (
    <>
    <Link to="/">Retour à l'accueil</Link>

      <HeroSection />
      <MapSection />

    </>
  )
}

export default Test


import React from 'react'
import { Link } from 'react-router-dom'
import '../index.css';

import HeroSection from '../components/ui/HeroSection.jsx';

function Test() {
  return (
    <>
    <Link to="/">Retour à l'accueil</Link>

      <HeroSection />

    </>
  )
}

export default Test


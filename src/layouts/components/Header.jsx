import React from 'react'
import { ModeToggle } from '../../hooks/mode-toggle'
import { Link } from 'react-router-dom'

function Header() {
  return (
    <header className='sticky top-0 backdrop-blur p-4 flex justify-between items-center'>
      <h1 className='text-xl font-bold '>
       <Link to="/test"> GreenTrip</Link>
      </h1>



      <ModeToggle />
    </header>
  )
}

export default Header

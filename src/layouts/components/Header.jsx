import React from 'react';
import {ModeToggle } from '../../hooks/mode-toggle.jsx';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";


const Header = () => (
    <div className="bg-gradient-to-r  p-8">
        <header className="flex justify-between items-center">


            
            <Link to="/test">
            <p className="text-10l font-extrabold tracking-tight">Green Trip</p>
            </Link>

            <div className="flex items-center">
            <Link to="/login" className='px-2'>
                <Button className='px-7 py-2'>Login</Button>
            </Link>
            <ModeToggle />
        </div>
        </header>
    </div>
);

export default Header;
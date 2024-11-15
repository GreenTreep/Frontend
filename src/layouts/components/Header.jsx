import React from 'react';
import {ModeToggle } from '../../hooks/mode-toggle.jsx';
import { Link } from 'react-router-dom';

const Header = () => (
    <div className="bg-gradient-to-r  p-8">
        <header className="flex justify-between items-center">
        <Link to="/test">
            <h1 className="text-5xl font-extrabold tracking-tight">Green Trip</h1>
            </Link>

            <ModeToggle />
        </header>
    </div>
);

export default Header;
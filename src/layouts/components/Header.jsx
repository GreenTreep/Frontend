// src/components/Header.jsx

import React from 'react';
import { ModeToggle } from '../../hooks/mode-toggle.jsx';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";

const Header = () => (
    <header className="top-0 w-full bg-transparent p-4 shadow-md backdrop-blur">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
            <Link to="/test">
                <p className="text-3xl dark:text-green-400 text-primary font-extrabold tracking-tight">GreenTrip</p>
            </Link>

            <div className="flex items-center">
                <Link to="/login" className='px-2'>
                    <Button className='px-7 py-2'>Login</Button>
                </Link>
                <ModeToggle />
            </div>
        </div>
    </header>
);

export default Header;

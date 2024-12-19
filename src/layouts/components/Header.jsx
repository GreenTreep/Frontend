import React from 'react';
import { ModeToggle } from '../../hooks/mode-toggle.jsx';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/security/auth/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"


const Header = () => {
    const { user,logout } = useAuth();
    const navigate = useNavigate();
    console.log('[Header] Current user state:', user);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <header className="top-0 w-full bg-transparent p-4 shadow-md backdrop-blur">
            <div className="flex justify-between items-center max-w-7xl mx-auto">
                <Link to="/test">
                    <p className="text-3xl dark:text-green-400 text-green-700 font-extrabold tracking-tight">GreenTrip</p>
                </Link>

                <div className="flex items-center">
                        {user ? (
                            <>
                            <DropdownMenu>
                            <DropdownMenuTrigger className="relative left-[-10px]">{user.firstName}</DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={handleLogout}>Déconnexion</DropdownMenuItem>
                            </DropdownMenuContent>
                            </DropdownMenu>
                        </>
                        ) : (
                            <Link to="/login" className="px-2">
                                <Button className="px-7 py-2">Login</Button>
                            </Link>
                        )}
                        <ModeToggle />
                        
                    </div>
            </div>
        </header>
    );
};


export default Header;

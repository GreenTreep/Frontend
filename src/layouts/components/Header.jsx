import React from 'react';

const Header = () => (
    <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white p-8">
        <header className="flex justify-between items-center">
            <h1 className="text-5xl font-extrabold tracking-tight">Green Trip</h1>
            <nav>
                <ul className="flex space-x-8">
                    <li><a href="Authentification" className="hover:underline transition duration-300">Connexion</a></li>
                </ul>
            </nav>
        </header>
    </div>
);

export default Header;
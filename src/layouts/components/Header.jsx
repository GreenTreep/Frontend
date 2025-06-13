import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/security/auth/AuthContext';
import { ModeToggle } from '../../hooks/mode-toggle.jsx';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import Helper from '@/help/Helper.jsx';
import { CircleUserRound, ShoppingCart } from 'lucide-react';4
import CartMenu from '@/components/shop/CartMenu'

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const isHelpAdminPage = location.pathname === '/help-admin';
  const isShop = location.pathname === '/shop';
  const isHomePage = location.pathname === '/';

  const handleLogout = () => {
    try {
      logout();
      navigate('/login');
    } catch (err) {
      console.error("Error during logout:", err);
    }
  };

  const renderUserOptions = () => {
    if (user?.role === 'ADMIN') {
      return (
        <Link to="/help-admin" className="px-2">
          <Button className="px-7 py-2">Support</Button>
        </Link>
      );
    }
    if (user?.role === 'USER' && isHomePage) {
      return <Helper />;
    }
    return null;
  };

  return (
    <header className="top-0 w-screen bg-transparent p-4 shadow-md">
      <div className="flex justify-between items-center max-w-7xl mx-auto">
        <Link to="/mapbox">
          <p className="text-3xl dark:text-green-400 text-green-700 font-extrabold tracking-tight">
            GreenTrip
          </p>
        </Link>
        
        <div>{renderUserOptions()}</div>

        {!isShop && <div>
            <Link to="/shop" className="px-2">
              <Button className='px-7 py-2'>Shop</Button>
            </Link>
          </div>}
        
        <div className="flex items-center space-x-2">
          {user ? (
            <>
            {isShop && (
              <>
              <Link to="/orders" className="px-2">
              <Button>
                Mes Commandes
              </Button>
              </Link>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size="icon">
                    <ShoppingCart />
                  </Button>
                </DropdownMenuTrigger>
                <CartMenu />
              </DropdownMenu></>
            )}
            <DropdownMenu className="mt-10" modal={false}>
              <DropdownMenuTrigger className="flex items-center ">
                <Button size="icon">
                  <CircleUserRound className='' />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="">
                <DropdownMenuLabel>{user.firstName}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>Déconnexion</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            </>
          ) : (!isHelpAdminPage &&
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
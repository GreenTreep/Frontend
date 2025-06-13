// NavUser.jsx
"use client";
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  CreditCard,
  LogOut,
  Sparkles,
  HandHelping,
} from "lucide-react";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useAuth } from "@/security/auth/AuthContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Helper from "@/help/Helper.jsx";

export function NavUser() {
  const { isMobile } = useSidebar();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isHelperOpen, setIsHelperOpen] = useState(false); // State to control Helper dialog

  console.log("[NavUser] Current user state:", user);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (!user) {
    // If the user is not logged in, display nothing or a "Login" button
    return null;
  }

  return (
    <>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src="https://media.licdn.com/dms/image/v2/D4E03AQE-EF-a2MYhKQ/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1721477790520?e=1740009600&v=beta&t=OtOu5OOWBLRuHbFcasTymyZIdW81dZ4NySwfomwyYtg" alt={user.firstName} />
                  <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{user.firstName}</span>
                  <span className="truncate text-xs">{user.email}</span>
                </div>
                <ChevronsUpDown className="ml-auto size-4" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
              side={isMobile ? "bottom" : "right"}
              align="end"
              sideOffset={4}
            >
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage src="https://media.licdn.com/dms/image/v2/D4E03AQE-EF-a2MYhKQ/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1721477790520?e=1740009600&v=beta&t=OtOu5OOWBLRuHbFcasTymyZIdW81dZ4NySwfomwyYtg" alt={user.firstName} />
                    <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">{user.firstName}</span>
                    <span className="truncate text-xs">{user.email}</span>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <Sparkles />
                  Upgrade to Pro
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <BadgeCheck />
                  Account
                </DropdownMenuItem>
                {/* Support DropdownMenuItem */}
                <DropdownMenuItem
                  onSelect={(e) => {
                    e.preventDefault(); // Prevent DropdownMenu from closing
                    setIsHelperOpen(true); // Open the Helper dialog
                  }}
                  className="cursor-pointer" 
                >
                  <HandHelping className="cursor-pointer" />
                  Support
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Bell />
                  Notifications
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>

      <Link to='/shop' >
        <Button className='w-full py-2'>
          Shop
        </Button>
      </Link>
      {/* Helper Dialog */}
      <Helper isOpen={isHelperOpen} onClose={() => setIsHelperOpen(false)} />
    </>
  );
}

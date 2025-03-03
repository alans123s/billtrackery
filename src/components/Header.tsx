
/**
 * Header Component
 * 
 * Application header/navbar that displays user information and logout button.
 * Only visible when a user is authenticated.
 * Adapts to different screen sizes with responsive design.
 */

import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

/**
 * Application header component with user information and logout button
 * Only displayed when user is authenticated
 */
const Header: React.FC = () => {
  const { auth, logout } = useAuth();

  // Don't render anything if user is not authenticated
  if (!auth.isAuthenticated) {
    return null;
  }

  /**
   * Generate initials from user name for avatar
   * @param name - User's full name
   * @returns String with up to 2 initials (first and last name)
   */
  const getInitials = (name: string | null) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(part => part[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  return (
    <header className="w-full py-4 px-6 backdrop-blur-sm bg-white/80 border-b border-gray-200 sticky top-0 z-10">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo and app name */}
        <div className="flex items-center gap-2">
          <img 
            src="/lovable-uploads/20d2e0f2-4085-486e-b7ca-78c9c344ac08.png"
            alt="Astro Energy Logo"
            className="h-10 w-auto"
          />
          <h1 className="text-lg font-semibold hidden sm:block text-astro-green">Astro Energy App</h1>
        </div>
        
        {/* User info and logout button */}
        {auth.isAuthenticated && (
          <div className="flex items-center gap-3">
            {/* User info with avatar - hidden on small screens */}
            <div className="flex items-center mr-2 hidden sm:flex">
              <Avatar className="h-8 w-8 mr-2">
                <AvatarFallback>{getInitials(auth.userName)}</AvatarFallback>
              </Avatar>
              <div className="text-sm">
                <p className="font-medium">{auth.userName}</p>
                <p className="text-xs text-muted-foreground truncate max-w-[120px]">{auth.userEmail}</p>
              </div>
            </div>
            
            {/* Logout button - responsive with text hidden on small screens */}
            <Button variant="outline" size="sm" onClick={logout}>
              <LogOut className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">Sair</span>
            </Button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;

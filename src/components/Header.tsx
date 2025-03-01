
import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { LogOut, User } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

const Header: React.FC = () => {
  const { auth, logout } = useAuth();

  if (!auth.isAuthenticated) {
    return null;
  }

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
        <div className="flex items-center gap-2">
          <img 
            src="data:image/png;base64,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"
            alt="CEMIG Logo"
            className="w-10 h-10"
          />
          <h1 className="text-lg font-semibold hidden sm:block">CEMIG App</h1>
        </div>
        
        {auth.isAuthenticated && (
          <div className="flex items-center gap-3">
            <div className="flex items-center mr-2 hidden sm:flex">
              <Avatar className="h-8 w-8 mr-2">
                <AvatarFallback>{getInitials(auth.userName)}</AvatarFallback>
              </Avatar>
              <div className="text-sm">
                <p className="font-medium">{auth.userName}</p>
                <p className="text-xs text-muted-foreground truncate max-w-[120px]">{auth.userEmail}</p>
              </div>
            </div>
            
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


import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="glass fixed top-0 left-0 right-0 z-10 py-4 px-6 flex items-center justify-between border-b border-border animate-fade-in">
      <div className="flex items-center">
        <div className="relative w-10 h-10 rounded-lg bg-budeshi flex items-center justify-center text-white font-semibold text-lg overflow-hidden">
          <span className="relative z-10">B</span>
          <div className="absolute inset-0 bg-gradient-to-br from-budeshi to-budeshi-dark opacity-90"></div>
        </div>
        <h1 className="ml-3 text-xl font-semibold tracking-tight">BUDESHI</h1>
        <div className="ml-2 bg-secondary text-secondary-foreground text-xs font-medium px-2 py-0.5 rounded-full">
          Beta
        </div>
      </div>
      <div className="text-sm hidden md:block">
        <span className="text-muted-foreground">Making Government </span>
        <span className="font-medium">Transparent</span>
      </div>
    </header>
  );
};

export default Header;

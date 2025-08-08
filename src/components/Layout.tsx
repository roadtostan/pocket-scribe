import React from 'react';
import { NavLink } from 'react-router-dom';
import { Book, Wallet, BarChart2, Cake } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container max-w-5xl mx-auto pb-20">
        {children}
      </main>
      
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-2">
        <div className="container max-w-5xl mx-auto flex justify-around items-center">
          <NavItem to="/" icon={<Book />} label="Home" />
          <NavItem to="/wallet" icon={<Wallet />} label="Wallet" />
          <NavItem to="/analysis" icon={<BarChart2 />} label="Analysis" />
          <NavItem to="/wanda-birthday" icon={<Cake />} label="Birthday" />
        </div>
      </nav>
    </div>
  );
};

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
}

const NavItem = ({ to, icon, label }: NavItemProps) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          'flex flex-col items-center px-4 py-2 text-sm font-medium rounded-md',
          isActive
            ? 'text-primary'
            : 'text-gray-500 hover:text-gray-700'
        )
      }
    >
      <div className="w-6 h-6">{icon}</div>
      <span className="mt-1">{label}</span>
    </NavLink>
  );
};

export default Layout;

import React from 'react';
import { Receipt } from 'lucide-react';
import Button from '../components/Button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/Context';

const Navbar = () => {
  const navigate = useNavigate();
  const { isLoggedIn,LogoutUser } = useAuth();

  const handleLogout = () => {
    LogoutUser();
    navigate('/');
  };

  return (
    <div>
      <nav className="relative top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <Receipt className="w-8 h-8 text-indigo-600" />
              <span
                className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600 cursor-pointer"
                onClick={() => navigate('/')}
              >
                SplitWise AI
              </span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-gray-900">
                Features
              </a>
              {isLoggedIn ? (
                <Button variant="primary" size="sm" onClick={handleLogout}>
                  Logout
                </Button>
              ) : (
                <Button variant="primary" size="sm" onClick={() => navigate('/signin')}>
                  Sign In
                </Button>
              )}
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
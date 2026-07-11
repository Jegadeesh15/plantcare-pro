import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from './components/ui/button';

const Header = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const user = token ? JSON.parse(localStorage.getItem('user') || '{}') : null;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
    window.location.reload();
  };

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">🌱</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">PlantCare Pro</h1>
              <p className="text-xs text-gray-600">AI Plant Disease Diagnosis</p>
            </div>
          </Link>

          {/* Navigation - Centered */}
          <nav className="hidden lg:flex items-center space-x-10 absolute left-1/2 -translate-x-1/2">
            <Link
              to="/"
              className="text-gray-800 hover:text-green-600 font-semibold transition-colors"
            >
              Home
            </Link>
            <Link
              to="/plant-selection"
              className="text-gray-800 hover:text-green-600 font-semibold transition-colors"
            >
              Diagnose
            </Link>
            <Link
              to="/database"
              className="text-gray-800 hover:text-green-600 font-semibold transition-colors"
            >
              Database
            </Link>
          </nav>

          {/* User / CTA Auth section */}
          <div className="hidden md:flex items-center space-x-4">
            {token ? (
              <div className="flex items-center space-x-4">
                <Button
                  onClick={() => navigate('/plant-selection')}
                  className="bg-green-900 hover:bg-black text-white px-6 py-2 rounded-lg font-bold transition-all"
                >
                  Start Diagnosis
                </Button>
                
                {/* Profile Dropdown */}
                <div className="relative group pb-4 -mb-4 pt-4 -mt-4 flex items-center">
                  <button className="flex items-center space-x-2 focus:outline-none pl-2">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-700 font-bold border border-green-300 shadow-sm transition-transform hover:scale-105">
                      {user?.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                  </button>
                  
                  {/* Dropdown Menu */}
                  <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 border border-gray-200 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <div className="px-4 py-3 border-b border-gray-100 bg-gray-50 rounded-t-md">
                      <p className="text-sm font-semibold text-gray-900 truncate">{user?.name}</p>
                      <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                    </div>
                    <button
                      onClick={() => navigate('/history')}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors"
                    >
                      Diagnosis History
                    </button>
                    <div className="border-t border-gray-100 my-1"></div>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      Log out
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <Button
                  onClick={() => navigate('/login')}
                  variant="ghost"
                  className="text-gray-800 hover:bg-gray-100 font-semibold"
                >
                  Sign In
                </Button>
                <Button
                  onClick={() => navigate('/plant-selection')}
                  className="bg-green-900 hover:bg-black text-white px-6 py-2 rounded-lg font-bold transition-all"
                >
                  Start Diagnosis
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden flex flex-col mt-4 pt-4 border-t border-gray-200 gap-4">
          <nav className="flex justify-around flex-wrap gap-2">
            <Link to="/" className="text-gray-700 hover:text-green-600 font-medium text-sm">Home</Link>
            <Link to="/plant-selection" className="text-gray-700 hover:text-green-600 font-medium text-sm">Diagnose</Link>
            <Link to="/image-analysis" className="text-gray-700 hover:text-green-600 font-medium text-sm">Image Analysis</Link>
            <Link to="/database" className="text-gray-700 hover:text-green-600 font-medium text-sm">Database</Link>
            {token && <Link to="/history" className="text-gray-700 hover:text-green-600 font-medium text-sm">History</Link>}
          </nav>
          
          <div className="flex justify-center gap-4">
            {token ? (
              <>
                <Button onClick={() => navigate('/plant-selection')} size="sm" className="bg-green-600 hover:bg-green-700 text-white">Start Diagnosis</Button>
                <Button onClick={handleLogout} size="sm" variant="outline" className="border-red-500 text-red-600 hover:bg-red-50">Logout</Button>
              </>
            ) : (
              <>
                <Button onClick={() => navigate('/login')} size="sm" variant="outline" className="border-green-600 text-green-600">Login</Button>
                <Button onClick={() => navigate('/register')} size="sm" className="bg-green-600 hover:bg-green-700 text-white">Sign Up</Button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
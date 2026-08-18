import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link, useLocation } from 'react-router-dom';

function Navbar() {
  const { logout, isAuthenticated } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isIngredientsDropdownOpen, setIsIngredientsDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed w-full z-20 top-0 start-0 border-default shadow-sm">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <Link to="/dashboard" className="flex items-center space-x-3 rtl:space-x-reverse">
          <img src="../../assets/coffee_foam.png" className="h-7" alt="PrepMeal Logo" />
          <span className="self-center text-xl text-heading font-semibold whitespace-nowrap">PrepMeal</span>
        </Link>
        
        <button 
          data-collapse-toggle="navbar-dropdown" 
          type="button" 
          className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-body rounded-base md:hidden hover:bg-neutral-secondary-soft hover:text-heading focus:outline-none focus:ring-2 focus:ring-neutral-tertiary" 
          aria-controls="navbar-dropdown" 
          aria-expanded="false"
        >
          <span className="sr-only">Open main menu</span>
          <svg className="w-6 h-6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="M5 7h14M5 12h14M5 17h14"/>
          </svg>
        </button>
        
        <div className="hidden w-full md:block md:w-auto" id="navbar-dropdown">
          <ul className="flex flex-col font-medium p-4 md:p-0 mt-4 border border-default rounded-base bg-neutral-secondary-soft md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-neutral-primary">
            
            <li>
              <Link 
                to="/dashboard" 
                className={`block py-2 px-3 rounded md:p-0 ${
                  isActive('/dashboard') 
                    ? 'text-white bg-brand md:bg-transparent md:text-fg-brand' 
                    : 'text-heading hover:bg-neutral-tertiary md:hover:bg-transparent md:hover:text-fg-brand'
                }`}
                aria-current={isActive('/dashboard') ? 'page' : undefined}
              >
                Home
              </Link>
            </li>
            
            <li className="relative">
              <button
                onClick={() => setIsIngredientsDropdownOpen(!isIngredientsDropdownOpen)}
                className={`flex items-center gap-1 py-2 px-3 rounded md:p-0 ${
                  isActive('/ingredients') || isActive('/categories') || isActive('/add-ingredient')
                    ? 'text-white bg-brand md:bg-transparent md:text-fg-brand'
                    : 'text-heading hover:bg-neutral-tertiary md:hover:bg-transparent md:hover:text-fg-brand'
                }`}
              >
                Ingredients
                  <path stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="m1 1 4 4 4-4"/>
              </button>
              
              {isIngredientsDropdownOpen && (
                <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg  py-1 z-10 md:mt-0 md:top-full bg-[#FBE9E7]">
                  <Link
                    to="/ingredients"
                    className="block px-4 py-2 text-sm text-heading bg-[#FBE9E7] hover:bg-neutral-secondary-soft"
                    onClick={() => setIsIngredientsDropdownOpen(false)}
                  >
                    All Ingredients
                  </Link>
                  <Link
                    to="/createingredient"
                    className="block px-4 py-2 text-sm text-heading bg-[#FBE9E7] hover:bg-neutral-secondary-soft"
                    onClick={() => setIsIngredientsDropdownOpen(false)}
                  >
                    Add New
                  </Link>
                </div>
              )}
            </li>
            
            {isAuthenticated ? (
              <>
                <li>
                  <button 
                    onClick={handleLogout}
                    className="block py-2 px-3 text-red-600 rounded hover:bg-red-50 md:hover:bg-transparent md:border-0 md:hover:text-red-700 md:p-0"
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <li>
                <Link 
                  to="/login" 
                  className={`block py-2 px-3 rounded md:p-0 ${
                    isActive('/login')
                      ? 'text-white bg-brand md:bg-transparent md:text-fg-brand'
                      : 'text-heading hover:bg-neutral-tertiary md:hover:bg-transparent md:hover:text-fg-brand'
                  }`}
                >
                  Login
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
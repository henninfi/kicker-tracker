import React, { useState, useRef, useEffect } from 'react';
// import { useFiefIsAuthenticated, useFiefUserinfo } from '@fief/fief/nextjs/react';
import Link from 'next/link';
import { useRedirectFunctions, useLogoutFunction, useAuthInfo } from "@propelauth/react";

const Header: React.FunctionComponent = () => {
  // const isAuthenticated = useFiefIsAuthenticated(); 
  // const userinfo = useFiefUserinfo();
  const {redirectToLoginPage, redirectToSignupPage, redirectToAccountPage} = useRedirectFunctions()
  const logoutFunction = useLogoutFunction()
  const authInfo = useAuthInfo();
  const logoutFn = useLogoutFunction();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  // Close the dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dropdownRef]);

  return (
    <header className="flex justify-between items-center p-4 bg-gray-800 text-white"> {/* Updated bg color */}
      {/* Left side of the header */}
      <nav>
        <ul className="flex space-x-4">
          {/* <li><Link href="/">Public page</Link></li>
          <li><Link href="/private">Private page</Link></li> */}
          <li><Link href="/my_sessions">My Sessions</Link></li>
        </ul>
      </nav>

      {/* Right side - User Menu */}
      <div className="relative" ref={dropdownRef}>
        <button onClick={toggleDropdown} className="focus:outline-none">
          {/* Three dots icon */}
          <div className="w-6 h-6 flex items-center justify-center">
            <span className="text-2xl">⋮</span>
          </div>
        </button>

        {isDropdownOpen && (
            <div className="absolute right-0 mt-2 py-2 w-72 bg-slate-200 rounded-md shadow-xl z-20">
              <div>
                {!authInfo.isLoggedIn &&  <button className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => redirectToLoginPage() /*(2)*/}>Login</button>}
              </div>
              {authInfo.isLoggedIn && authInfo.user && (
              <div>
                <a className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  {authInfo.user.email}
                </a>
                    {/* {userinfo.fields && (
                      <div className="px-4 py-2 text-sm text-gray-700">
                        {Object.entries(userinfo.fields).map(([key, value]) => (
                          <div key={key}>{key}: {value}</div>
                        ))}
                      </div>
                    )} */}
                <div className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  <button  onClick={() => logoutFn(true) /*(2)*/}>Logout</button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;


import Link from 'next/link'
import React, { useState, useRef, useEffect } from 'react';
import MaxWidthWrapper from '../MaxWidthWrapper'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './dropdown-menu'
import { buttonVariants } from './button'
import { useRedirectFunctions, useLogoutFunction, useAuthInfo } from "@propelauth/react";
import { ArrowRight } from 'lucide-react'
import UserAccountNav from '../UserAccountNav'
import MobileNav from '../MobileNav'
import { Gem } from 'lucide-react'

const Navbar = () => {
  const {redirectToLoginPage, redirectToSignupPage, redirectToAccountPage} = useRedirectFunctions()
  const authInfo = useAuthInfo();
  const user = authInfo.user
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const logoutFn = useLogoutFunction();



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
    <nav className='sticky h-14 inset-x-0 top-0 z-30 w-full border-b border-gray-200 bg-white/75 backdrop-blur-lg transition-all'>
      <MaxWidthWrapper>
        <div className='flex h-14 items-center justify-between border-b border-zinc-200'>
          
        <ul className="flex space-x-4 items-center justify-between">
          <li>
            <Link href='/' className='flex z-40 font-semibold'>
              <span>Rankit</span>
            </Link>
          </li>
        </ul>

          


          <MobileNav isAuth={!!user} />

          <div className='hidden items-center space-x-4 sm:flex'>
            {!user ? (
              <>
                <Link
                  href='/pricing'
                  className={buttonVariants({
                    variant: 'ghost',
                    size: 'sm',
                  })}>
                  Pricing
                </Link>
                {!authInfo.isLoggedIn &&  <button className="block px-2 py-1 text-sm bg-gray-200 rounded-2xl border text-gray-800 hover:bg-gray-300" onClick={() => redirectToLoginPage()}>Login</button>}
                {!authInfo.isLoggedIn &&  <button className="block px-4 py-1 text-sm bg-blue-600 rounded-2xl border text-gray-200 hover:bg-blue-700" onClick={() => redirectToSignupPage()}>Register now</button>}
              </>
            ) : (
              <>
              <Link 
                href="/pricing"
                className={buttonVariants({
                  variant: 'ghost',
                  size: 'sm',
                })}>
                  Pricing
              </Link>
              <Link 
                href="/my_sessions"
                className={buttonVariants({
                  variant: 'ghost',
                  size: 'sm',
                })}>
                  My Sessions
                </Link>


                <DropdownMenuSeparator />
                
          

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
                          {false ? (
                            <Link href='/dashboard/billing'>
                              Manage Subscription
                            </Link>
                          ) : (
                            <a className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                            <Link href='/pricing'>
                              <span className='inline-flex items-center'> {/* Add this span with inline-flex */}
                                <Gem className='text-blue-600 h-4 w-4 mr-1.5' /> {/* Adjusted margin for spacing */}
                                Upgrade
                              </span>
                            </Link>
                          </a>
                
                          )}
                          <div className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                          {authInfo.isLoggedIn &&  <button onClick={() => redirectToAccountPage()}>Account</button>}
                          </div>
                          <div className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                            <button  onClick={() => logoutFn(true) /*(2)*/}>Logout</button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </MaxWidthWrapper>
    </nav>
  )
}

export default Navbar

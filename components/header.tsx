import { useFiefIsAuthenticated, useFiefUserinfo } from '@fief/fief/nextjs/react';
import Link from 'next/link';
import React from 'react';

const Header: React.FunctionComponent = () => {
  const isAuthenticated = useFiefIsAuthenticated(); 
  const userinfo = useFiefUserinfo();

  return (
    <ul>
      <li><Link href="/">Public page</Link></li>
      <li><Link href="/private">Private page</Link></li>
      <li>
        Castles
        <ul>
          <li><Link href="/castles">Index</Link></li>
          <li><Link href="/castles/create">Create</Link></li>
        </ul>
      </li>
      <li>
        {}
        {!isAuthenticated && <Link href="/login">Login</Link>}
        {isAuthenticated && userinfo && (
          <div>
            <span>{userinfo.email} - </span>
            <span>{userinfo.fields["temp_scope"]} - </span>
            {}
            <Link href="/logout">Logout</Link>
          </div>
        )}
      </li>
    </ul>
  );
};

export default Header;

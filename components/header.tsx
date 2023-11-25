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
            {userinfo.fields && (
  <div>
    {Object.entries(userinfo.fields).map(([key, value]) => (
      <div key={key}>{key}: {value}</div>
    ))}
  </div>
)}
            {}
            <Link href="/logout">Logout</Link>
          </div>
        )}
      </li>
    </ul>
  );
};

export default Header;

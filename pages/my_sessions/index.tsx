// pages/MySessions.tsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { useFiefIsAuthenticated, useFiefUserinfo } from '@fief/fief/nextjs/react';
import { useQuery } from '@tanstack/react-query';
import SessionCard from '../../components/sessioncard'; // Ensure to create this component
import NewSessionCard from '../../components/NewSessionCard'; // Ensure to create this component
import { SessionOut } from '../api/sessions/sessiontypes'
import { useFiefAccessTokenInfo } from '@fief/fief/nextjs/react';


const MySessions = () => {
  const isAuthenticated = useFiefIsAuthenticated();
  const accessTokenInfo = useFiefAccessTokenInfo();
  const userinfo = useFiefUserinfo();
  const router = useRouter();
  const NEXT_PUBLIC_API = process.env.NEXT_PUBLIC_API;

  const { data: sessions, isLoading, isError } = useQuery<SessionOut[]>({
    queryKey: ['mySessions'],
    queryFn: () => {
      // Axios configuration for cross-origin requests
      const config = {
        withCredentials: true,  // This tells axios to send cookies along with the request
      };
  
      return axios.get(`${NEXT_PUBLIC_API}/sessions/user-sessions/`, config).then(res => res.data);;
    },
    enabled: isAuthenticated,
  });



  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error fetching sessions</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">My Sessions</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {
        accessTokenInfo && accessTokenInfo.permissions.includes('session:create') && <NewSessionCard />
        }
        {(sessions || []).map((session) => (
          <SessionCard key={session.id} session={session} />
        ))}
      </div>
    </div>
  );
};

export default MySessions;

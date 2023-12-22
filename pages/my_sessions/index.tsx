// pages/MySessions.tsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
// import { useFiefIsAuthenticated, useFiefUserinfo } from '@fief/fief/nextjs/react';
import { useQuery } from '@tanstack/react-query';
import SessionCard from '../../components/sessioncard'; // Ensure to create this component
import NewSessionCard from '../../components/NewSessionCard'; // Ensure to create this component
import { SessionOut } from '../api/sessions/sessiontypes'
// import { useFiefAccessTokenInfo } from '@fief/fief/nextjs/react';
import { useRedirectFunctions, useLogoutFunction, useAuthInfo } from "@propelauth/react";



const MySessions = () => {
  const authInfo = useAuthInfo();
  const router = useRouter();
  const NEXT_PUBLIC_API = process.env.NEXT_PUBLIC_API;

  const { data: sessions, isLoading, isError } = useQuery<SessionOut[]>({
    queryKey: ['mySessions'],
    queryFn: async () => {
      if (!NEXT_PUBLIC_API) {
        throw new Error("API URL is not defined");
      }
      console.log(authInfo.accessToken)
  
      if (!authInfo || !authInfo.accessToken) {
        throw new Error("Access token is missing");
      }
  
      const headers = {
        Authorization: `Bearer ${authInfo.accessToken}`,
        Accept: 'application/json', // Set the Accept header to JSON
      };
  
      const response = await axios.get(`${NEXT_PUBLIC_API}/sessions/user-sessions/`, { headers });
      return response.data;
    },
    enabled: authInfo.isLoggedIn,
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
        authInfo.isLoggedIn && <NewSessionCard />
        }
        {authInfo.isLoggedIn && (sessions || []).map((session) => (
          <SessionCard key={session.id} session={session} />
        ))}
      </div>
    </div>
  );
};

export default MySessions;

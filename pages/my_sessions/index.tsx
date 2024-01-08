// pages/MySessions.tsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
// import { useFiefIsAuthenticated, useFiefUserinfo } from '@fief/fief/nextjs/react';
import { useQuery, QueryClient, useQueryClient, useMutationState } from '@tanstack/react-query';
import SessionCard from '../../components/sessioncard'; // Ensure to create this component
import NewSessionCard from '../../components/NewSessionCard'; // Ensure to create this component
import { SessionOut } from '../api/sessions/sessiontypes'
import { Player } from "../../domain/Player";
// import { useFiefAccessTokenInfo } from '@fief/fief/nextjs/react';
import { useRedirectFunctions, useLogoutFunction, useAuthInfo, withAuthInfo, withRequiredAuthInfo } from "@propelauth/react";
import { C } from 'chart.js/dist/chunks/helpers.core';




const MySessions = withRequiredAuthInfo((props) => {
  const router = useRouter();
  const NEXT_PUBLIC_API = process.env.NEXT_PUBLIC_API;

  

  const { data: sessions, isLoading, isError } = useQuery<SessionOut[]>({
    queryKey: ['mySessions'],
    queryFn: async () => {
      if (!NEXT_PUBLIC_API) {
        throw new Error("API URL is not defined");
      }
      console.log(props.accessToken)
  
      if (!props.isLoggedIn) {
        throw new Error("User is not logged in");
      }
  
      const headers = {
        Authorization: `Bearer ${props.accessToken}`,
        Accept: 'application/json', // Set the Accept header to JSON
      };
  
      const response = await axios.get(`${NEXT_PUBLIC_API}/sessions/user-sessions/`, { headers });
      return response.data;
    },
    enabled: props.isLoggedIn,
  });

  const { data:currentPlayer, isError:currentPlayerisError, isLoading:isCurrentPlayerLoading } = useQuery<Player | Boolean>({
    queryKey: ['currentPlayer'],
    queryFn: async () => {
      if (!NEXT_PUBLIC_API) {
        throw new Error("API URL is not defined");
      }
      console.log(props.accessToken)
  
      if (!props.isLoggedIn) {
        throw new Error("User is not logged in");
      }
  
      const headers = {
        Authorization: `Bearer ${props.accessToken}`,
        Accept: 'application/json', // Set the Accept header to JSON
      };
  
      const currentPlayer_response = await axios.get(`${NEXT_PUBLIC_API}/players/get_current_player/`, { headers });
      return currentPlayer_response.data;
    },
    enabled: props.isLoggedIn,
  });


  useEffect(() => {
    // Perform the redirect only after everything has been checked and is stable
    if (currentPlayer === false && props.isLoggedIn && !isCurrentPlayerLoading) {
      router.push('/player/create');
    }
  }, [currentPlayer, props.isLoggedIn, isCurrentPlayerLoading]); // Only re-run the effect if these values change

  



  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error fetching sessions</div>;
  }

  console.log('currentPlayer', currentPlayer)
  // Check if currentPlayer is null and the user is logged in


  return (
    <div className="container mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">My Sessions</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {currentPlayer !== undefined && props.isLoggedIn && 
      <NewSessionCard />
      }
        {props.isLoggedIn && (sessions || []).map((session) => (
          <SessionCard key={session.id} session={session} />
        ))}
      </div>
    </div>
  );
});

export default MySessions;

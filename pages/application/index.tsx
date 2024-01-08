// pages/ny_versjon/index.tsx

import axios from "axios";
import { endOfDay } from "date-fns";
import { useEffect, useMemo, useState } from "react";
import { SessionProvider } from 'next-auth/react'
import Button from "../../components/button";
import Card from "../../components/card";
import GameForm from "../../components/game-form";
import GameList from "../../components/game-list";
import PlayerForm from "../../components/player-form";
import PlayerGraph from "../../components/player-graph";
import PlayerList from "../../components/player-list";
import TournamentForm from "../../components/tournament-form";
import { DataContext } from "../../data";
import { Game, Team } from "../../domain/Game";
import { Leaderboard } from "../../domain/Leaderboard";
import { Player, PlayerId } from "../../domain/Player";
import { Tournament } from "../../domain/Tournament";
import { SessionOut, SessionListType } from '../api/sessions/sessiontypes'
// import { useFiefIsAuthenticated, useFiefUserinfo } from '@fief/fief/nextjs/react'
import { useRouter } from 'next/router';
import SessionMenu from '../../components/SessionMenu';
import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import { useRedirectFunctions, useLogoutFunction, useAuthInfo, withAuthInfo,withRequiredAuthInfo  } from "@propelauth/react";
import InviteForm from '../../components/invite-form'
import ShareLinkButton from "../../components/ShareLinkButton";


const Page = withRequiredAuthInfo((props) => {
  const router = useRouter();

  const [players, setPlayers] = useState<Player[]>([]);
  const [games, setGames] = useState<Game[]>([]);
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [tab, setTab] = useState<"games" | "players">("games");
  const [isAddingPlayer, setIsAddingPlayer] = useState(false);
  const [isShowingGraph, setIsShowingGraph] = useState(false);
  const [isAddingGame, setIsAddingGame] = useState(false);
  const [isAddingTournament, setIsAddingTournament] = useState(false);
  const [isInvitingFriendByEmail, setIsInvitingFriendByEmail] = useState(false);
  const [isInvitingFriendByURL, setIsInvitingFriendByURL] = useState(false);
  // const isAuthenticated = useFiefIsAuthenticated(); 
  // const userinfo = useFiefUserinfo();
  const authInfo = useAuthInfo();
  

  

  const sessionId = router.query.sessionId as string;
  const NEXT_PUBLIC_API: string | undefined = process.env.NEXT_PUBLIC_API;

  
  let { data: currentSession, isLoading, isError } = useQuery<SessionOut>({
    queryKey: ['currentSession'],
    queryFn: async () => {
      if (!NEXT_PUBLIC_API) {
        throw new Error("API URL is not defined");
      }
      console.log(authInfo.accessToken)
  
      if (!authInfo.isLoggedIn) {
        throw new Error("User is not logged in");
      }
  
      const headers = {
        Authorization: `Bearer ${authInfo.accessToken}`,
        Accept: 'application/json', // Set the Accept header to JSON
      };
  
      const response = await axios.get(`${NEXT_PUBLIC_API}/sessions/sessions_id/${sessionId}`, { headers });
      return response.data;
    },
    enabled: authInfo.isLoggedIn,
  });

  console.log('session_type', currentSession?.session_type)
  const gamesQuery = useQuery({
    queryKey: ['games', sessionId],
    queryFn: () => {
      // Axios configuration for cross-origin requests
      const headers = {
        Authorization: `Bearer ${props.accessToken}`,
        Accept: 'application/json', // Set the Accept header to JSON
      };
  
      return axios.get(`${NEXT_PUBLIC_API}/games/${sessionId}`, { headers }).then(res => res.data);
    },
    select: (data: any[]) => data.map((game: any) => ({
      ...game,
      winnerTeam: JSON.parse(game.winnerTeam),
      loserTeam: JSON.parse(game.loserTeam),
      createdAt: new Date(game.createdAt)
    })),
    enabled: !!sessionId,
  });
  

 
   // Initially assume false until found otherwise
   let isAdmin = false;
   let isUser = false;

  // Define the function or arrow function
  const isUserInSessionList = (currentSession: SessionOut, listType: SessionListType, userId: string) => {
    const list = currentSession[listType] ?? [];
    return list.includes(userId);
  };
  
  // Update variables if conditions are met
  if (authInfo.isLoggedIn && currentSession) {
      const userId = authInfo.user?.['userId']; // Use optional chaining in case it's undefined
      if (userId) {
          isAdmin = isUserInSessionList(currentSession, 'admin_ids', userId);
          isUser = isUserInSessionList(currentSession, 'user_ids', userId);
      }
  }
  

  const playersQuery = useQuery({
    queryKey: ['players', sessionId],
    queryFn: () => {
      // Axios configuration for cross-origin requests
      const headers = {
        Authorization: `Bearer ${props.accessToken}`,
        Accept: 'application/json', // Set the Accept header to JSON
      };
  
      return axios.get(`${NEXT_PUBLIC_API}/players/${sessionId}`, { headers }).then(res => res.data);
    },
    enabled: !!sessionId,
  });
  
  const tournamentsQuery = useQuery({
    queryKey: ['tournaments'],
    queryFn: () => {
      // Axios configuration for cross-origin requests
      const headers = {
        Authorization: `Bearer ${props.accessToken}`,
        Accept: 'application/json', // Set the Accept header to JSON
      };
  
      return axios.get(`${NEXT_PUBLIC_API}/tournaments`, { headers }).then(res => res.data);
    }
  });  

  useEffect(() => {
    // Check for session type in URL and update state accordingly
    const sessionType = router.query.sessionType;
    if (sessionType === 'casual' || sessionType === 'ranked') {
      // Update your state or logic based on sessionType
    }
  }, [router.query]);

  // Define a default leaderboard object that matches the Leaderboard type
const defaultLeaderboard = new Leaderboard([], [], []);

const leaderboard = useMemo(() => {
  if (!gamesQuery.data || !playersQuery.data || !tournamentsQuery.data) return defaultLeaderboard;
  return new Leaderboard(playersQuery.data, gamesQuery.data, tournamentsQuery.data);
}, [playersQuery.data, gamesQuery.data, tournamentsQuery.data]);


  function getPlayer(id: PlayerId | undefined) {
    const player = playersQuery.data?.find((el: Player) => el.id === id);
    return (
      player || { id: "placeholder", name: "", animal: "bat", isRetired: false }
    );
  }
  

  const history = useMemo(() => {
    // Ensure that leaderboard is defined and has the 'events' property
    if (!leaderboard || !leaderboard.events) {
      return [];
    }
  
    return leaderboard.events
      .map((event) => endOfDay(event.createdAt).getTime())
      .filter((date, index, array) => array.indexOf(date) === index)
      .map((date) => ({
        date,
        rankings: leaderboard.getRankedPlayers(new Date(date)),
      }));
  }, [leaderboard]);
  
   
  return (
    <div className="w-full max-w-3xl m-auto">
    {gamesQuery.isLoading || playersQuery.isLoading || tournamentsQuery.isLoading ? (
      <div>Loading...</div>
    ) : gamesQuery.error || playersQuery.error || tournamentsQuery.error ? (
      <div>Error fetching data</div>
    ) : (
    <div className="w-full max-w-3xl m-auto">
      <div className="flex py-3 justify-around">
        <Button
          textSize="text-base"
          backgroundColor={tab === "games" ? "bg-gray-300" : undefined}
          onClick={() => setTab("games")}
        >
          games
        </Button>
        <Button
          textSize="text-base"
          backgroundColor={tab === "players" ? "bg-gray-300" : undefined}
          onClick={() => setTab("players")}
        >
          leaderboard & Settings
        </Button>
      </div>
      <DataContext.Provider
        value={{
          players: playersQuery.data || [],
          games: gamesQuery.data || [],
          getPlayer,
          leaderboard,
          history,
          isLoading: gamesQuery.isLoading || playersQuery.isLoading || tournamentsQuery.isLoading,
        }}
      >
        {tab === "games" && (
          <>
            {isAddingGame ? (
              <GameForm onClose={() => setIsAddingGame(false)} />
            ) : isAddingTournament ? (
              <TournamentForm onClose={() => setIsAddingTournament(false)} />
            ) : authInfo.isLoggedIn && isAdmin || isUser  ? (
            // For casual game
              <div className="flex">
                {/* <Card
                  className="basis-1/2 mr-4 text-center cursor-pointer p-4"
                  onClick={() => setIsAddingTournament(true)}
                >
                  Create tournament 🏆
                </Card> */}
                <Card
                  onClick={() => setIsAddingGame(true)}
                  className="w-full text-center cursor-pointer p-4"
                >
                  Register game ⚽
                </Card>
              </div>
            ) : 
            null}

            <GameList />
          </>
        )}
        {tab === "players" && (
        <>
          {isShowingGraph ? (
            <PlayerGraph onClose={() => setIsShowingGraph(false)} />
          ) : isAddingPlayer ? (
            <PlayerForm onClose={() => setIsAddingPlayer(false)} />
          ) : null}

          <div className="flex mb-4">
            {/* Conditional rendering for Register player button */}
            {authInfo.isLoggedIn && currentSession?.session_type === 'casual' && (isAdmin || isUser) && (
              <Card
                className="basis-1/2 mr-4 text-center cursor-pointer p-4"
                onClick={() => setIsAddingPlayer(true)}
              >
                Register player 👤
              </Card>
            )}

            {
              !isInvitingFriendByURL && currentSession?.session_type === 'ranked' ? (
                <Card
                  onClick={() => setIsInvitingFriendByURL(true)}
                  className="basis-1/2 mr-4 text-center cursor-pointer p-4"
                >
                  Invite Friends to Session
                </Card>
              ) : isInvitingFriendByURL ? (
                <ShareLinkButton onClose={() => setIsInvitingFriendByURL(false)} />
              ) : null // Do not render anything if the session is not 'ranked'
            }


            {/* Always show the Stats button */}
            <Card
              onClick={() => setIsShowingGraph(true)}
              className="basis-1/2 text-center cursor-pointer p-4"
            >
              Stats 📊
            </Card>
          </div>

          <div>
            <PlayerList />
          </div>
        </>
      )}

      </DataContext.Provider>

      {/* <div className="mt-4 flex justify-center underline">
        <a
          href="https://github.com/JonathanWbn/kicker-tracker"
          target="_blank"
          rel="noreferrer"
        >
          Source
        </a>
      </div> */}
    </div>

)}
</div>
);
})
export default Page;

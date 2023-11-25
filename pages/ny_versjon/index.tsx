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
import { useFiefIsAuthenticated, useFiefUserinfo } from '@fief/fief/nextjs/react'
import { useRouter } from 'next/router';
import SessionMenu from '../../components/SessionMenu';

export default function Page() {
  const router = useRouter();

  const [players, setPlayers] = useState<Player[]>([]);
  const [games, setGames] = useState<Game[]>([]);
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [tab, setTab] = useState<"games" | "players">("games");
  const [isAddingPlayer, setIsAddingPlayer] = useState(false);
  const [isShowingGraph, setIsShowingGraph] = useState(false);
  const [isAddingGame, setIsAddingGame] = useState(false);
  const [isAddingTournament, setIsAddingTournament] = useState(false);
  const isAuthenticated = useFiefIsAuthenticated(); 
  const userinfo = useFiefUserinfo();

  useEffect(() => {
    // Check for session type in URL and update state accordingly
    const sessionType = router.query.sessionType;
    if (sessionType === 'casual' || sessionType === 'ranked') {
      // Update your state or logic based on sessionType
    }
  }, [router.query]);

  const leaderboard = useMemo(
    () => new Leaderboard(players, games, tournaments),
    [players, games, tournaments]
  );

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    const [{ data: players }, { data: games }, { data: tournaments }] =
      await Promise.all([
        axios.get<Player[]>("/api/players"),
        axios.get<Game[]>("/api/games"),
        axios.get<Tournament[]>("/api/tournaments"),
      ]);

     // When mapping over the games received from the API
    const gamesParsed: Game[] = games.map(game => ({
      ...game,
      winnerTeam: JSON.parse(game.winnerTeam as any) ,
      loserTeam: JSON.parse(game.loserTeam as any),
      createdAt: new Date(game.createdAt)
    }));

    

    setIsLoading(false);
    setPlayers(players);
    setGames(gamesParsed);
    setTournaments(tournaments);

    console.log("games", gamesParsed)
  }

  function getPlayer(id: PlayerId | undefined) {
    const player = players?.find((el) => el.id === id);
    return (
      player || { id: "placeholder", name: "", animal: "bat", isRetired: false }
    );
  }

  const history = useMemo(
    () =>
      leaderboard.events
        .map((event) => endOfDay(event.createdAt).getTime())
        .filter((date, index, array) => array.indexOf(date) === index)
        .map((date) => ({
          date,
          rankings: leaderboard.getRankedPlayers(new Date(date)),
        })),
    [leaderboard]
  );
   
  return (
  
    <div className="w-full max-w-3xl m-auto">
      <div className="flex py-3 justify-around">
        <Button
          textSize="text-base"
          backgroundColor={tab === "games" ? "bg-slate-600" : undefined}
          onClick={() => setTab("games")}
        >
          games
        </Button>
        <Button
          textSize="text-base"
          backgroundColor={tab === "players" ? "bg-slate-600" : undefined}
          onClick={() => setTab("players")}
        >
          leaderboard & Settings
        </Button>
      </div>
      <DataContext.Provider
        value={{
          players,
          games,
          getPlayer,
          leaderboard,
          history,
          isLoading,
        }}
      >
        {tab === "games" && (
          <>
            {isAddingGame ? (
              <GameForm onClose={() => setIsAddingGame(false)} />
            ) : isAddingTournament ? (
              <TournamentForm onClose={() => setIsAddingTournament(false)} />
            ) : isAuthenticated ? (
              <div className="flex">
                <Card
                  className="basis-1/2 mr-4 text-center cursor-pointer p-4"
                  onClick={() => setIsAddingTournament(true)}
                >
                  Create tournament 🏆
                </Card>
                <Card
                  onClick={() => setIsAddingGame(true)}
                  className="basis-1/2 text-center cursor-pointer p-4"
                >
                  Register game ⚽
                </Card>
              </div>
            ) : null}

            <GameList />
          </>
        )}
        {tab === "players" && (
          <>
            {isShowingGraph ? (
              <PlayerGraph onClose={() => setIsShowingGraph(false)} />
            ) : isAddingPlayer ? (
              <PlayerForm onClose={() => setIsAddingPlayer(false)} />
            ) : (
              <div className="flex mb-4">
                <Card
                  className="basis-1/2 mr-4 text-center cursor-pointer p-4"
                  onClick={() => setIsAddingPlayer(true)}
                >
                  Register user 👤
                </Card>
                <Card
                  onClick={() => setIsShowingGraph(true)}
                  className="basis-1/2 text-center cursor-pointer p-4"
                >
                  Stats 📊
                </Card>
              </div>
            )}
            <PlayerList />
          </>
        )}
      </DataContext.Provider>

      <div className="mt-4 flex justify-center underline">
        <a
          href="https://github.com/JonathanWbn/kicker-tracker"
          target="_blank"
          rel="noreferrer"
        >
          Source
        </a>
      </div>
    </div>

  );
}

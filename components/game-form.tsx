import axios from "axios";
import { uniq } from "lodash";
import Image from "next/image";
import { MouseEvent, useContext, useState } from "react";
import { DataContext } from "../data";
import { Team, Game, NewGame } from "../domain/Game";
import { Leaderboard } from "../domain/Leaderboard";
import { PlayerId } from "../domain/Player";
import Button from "./button";
import Card from "./card";
import { useMutation, useMutationState, useQueryClient } from '@tanstack/react-query';
import { useAuthInfo } from "@propelauth/react";

  import { useRouter } from 'next/router';


function GameForm({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const authInfo = useAuthInfo();

  const { leaderboard } = useContext(DataContext);
  const [winnerTeam, setWinnerTeam] = useState<Team>(["", ""]);
  const [loserTeam, setLoserTeam] = useState<Team>(["", ""]);

  const queryClient = useQueryClient();
  const sessionId = router.query.sessionId as string;
  const NEXT_PUBLIC_API: string | undefined = process.env.NEXT_PUBLIC_API;

  const headers = {
    Authorization: `Bearer ${authInfo.accessToken}`,
    Accept: 'application/json', // Set the Accept header to JSON
  };
  // Define the mutation for posting a new game
  const postGameMutation = useMutation({
    mutationFn: (newGameData: NewGame) => axios.post(`${NEXT_PUBLIC_API}/games/${sessionId}`, newGameData, {headers}),
    onSuccess: () => {
      // Correct usage of invalidateQueries with query filters
      queryClient.invalidateQueries({ queryKey: ['games', sessionId] });
    },
    mutationKey: ['addGame']
  });


  

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!isComplete) return;

    const newGame: NewGame = {
      winnerTeam: [winner1, winner2],
      loserTeam: [loser1, loser2],
    };

    postGameMutation.mutate(newGame);
    onClose();
  }
  const { isPending, variables } = postGameMutation
  const [winner1, winner2] = winnerTeam;
  const [loser1, loser2] = loserTeam;

  const isComplete =
    ((winnerTeam.filter(Boolean).length === 1 &&
      loserTeam.filter(Boolean).length === 1) ||
      (winnerTeam.filter(Boolean).length === 2 &&
        loserTeam.filter(Boolean).length === 2)) &&
    uniq([...winnerTeam, ...loserTeam].filter(Boolean)).length ===
      [...winnerTeam, ...loserTeam].filter(Boolean).length;

  const delta =
    isComplete &&
    Leaderboard.getGameDelta(
      { id: "", createdAt: Date.now() as any, winnerTeam, loserTeam, isOptimistic: false, delta:0 },
      leaderboard.getRankedPlayers()
    );


  function handleWinnerSelect(playerId: PlayerId) {
    if (winnerTeam.includes(playerId)) {
      setWinnerTeam([
        winner1 === playerId ? "" : winner1,
        winner2 === playerId ? "" : winner2,
      ]);
    } else if (winner1 && winner2) {
      return;
    } else if (winner1) {
      setWinnerTeam([winner1, playerId]);
    } else {
      setWinnerTeam([playerId, winner2]);
    }
  }

  function handleLoserSelect(playerId: PlayerId) {
    if (loserTeam.includes(playerId)) {
      setLoserTeam([
        loser1 === playerId ? "" : loser1,
        loser2 === playerId ? "" : loser2,
      ]);
    } else if (loser1 && loser2) {
      return;
    } else if (loser1) {
      setLoserTeam([loser1, playerId]);
    } else {
      setLoserTeam([playerId, loser2]);
    }
  }

  return (
    <Card isActive>
      <div className="flex justify-between px-4 items-center border-b border-gray-200">
        <p className="text-xl ">Winner</p>
        {delta && <p className="text-lg">Δ {delta}</p>}
        <p className="text-xl">Loser</p>
      </div>
      <div className="flex">
        <div className="flex flex-col items-start flex-grow">
          {leaderboard
            .getRankedPlayers()
            .filter((player) => !player.isRetired)
            .map((player) => (
              <Button
                key={player.id}
                textSize="text-base"
                backgroundColor={
                  winnerTeam.includes(player.id) ? "bg-gray-300" : undefined
                }
                className="mt-1 flex items-center normal-case"
                onClick={() => handleWinnerSelect(player.id)}
              >
                <Image
                  src={`/animals/${player.animal}.png`}
                  alt={player.animal}
                  width={24}
                  height={24}
                />
                <span className="ml-2">{player.name}</span>
              </Button>
            ))}
        </div>
        <div className="flex flex-col items-end">
          {leaderboard
            .getRankedPlayers()
            .filter((player) => !player.isRetired)
            .map((player) => (
              <Button
                key={player.id}
                textSize="text-base"
                backgroundColor={
                  loserTeam.includes(player.id) &&
                  winnerTeam.includes(player.id)
                    ? "bg-red-400"
                    : loserTeam.includes(player.id)
                    ? "bg-gray-300"
                    : undefined
                }
                className="mt-1 flex justify-end items-center normal-case"
                onClick={() => handleLoserSelect(player.id)}
              >
                <span className="mr-2">{player.name}</span>
                <Image
                  src={`/animals/${player.animal}.png`}
                  alt={player.animal}
                  width={24}
                  height={24}
                />
              </Button>
            ))}
        </div>
      </div>
      <div className="flex justify-around mt-4">
        <Button
          onClick={onClose}
          textSize="text-base"
          backgroundColor="bg-gray-200 border border-gray-400"
        >
          cancel
        </Button>
        <Button
          backgroundColor="bg-green-500 border border-gray-400"
          textSize="text-base"
          onClick={handleSubmit}
        >
          create
        </Button>
      </div>
    </Card>
  );
}

export default GameForm;

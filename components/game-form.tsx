import { MouseEvent, useContext, useState } from "react";
import axios from "axios";

import { DataContext } from "../pages";
import { Team } from "../domain/Game";
import Image from "next/image";
import { PlayerId } from "../domain/Player";
import { uniq } from "lodash";
import Button from "./button";
import Card from "./card";

function GameForm() {
  const { refresh, leaderboard } = useContext(DataContext);
  const [isAdding, setIsAdding] = useState(false);
  const [winnerTeam, setWinnerTeam] = useState<Team>(["", ""]);
  const [loserTeam, setLoserTeam] = useState<Team>(["", ""]);

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
    leaderboard.getGameDelta(
      { id: "", createdAt: Date.now(), winnerTeam, loserTeam },
      leaderboard.getRankedPlayers()
    );

  async function handeSubmit(e: MouseEvent<HTMLButtonElement>) {
    if (!isComplete) {
      return;
    }

    await axios.post("/api/games", {
      winnerTeam: [winner1, winner2],
      loserTeam: [loser1, loser2],
    });
    void refresh();
    setLoserTeam(["", ""]);
    setWinnerTeam(["", ""]);
    setIsAdding(false);
  }

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
    <Card isActive={isAdding} onClick={() => !isAdding && setIsAdding(true)}>
      {isAdding ? (
        <>
          <div className="flex justify-between px-4 items-center border-b border-slate-500">
            <p className="text-xl font-bold">Winner</p>
            {delta && <p className="text-lg">Δ {delta}</p>}
            <p className="text-xl font-bold">Loser</p>
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
                      winnerTeam.includes(player.id)
                        ? "bg-slate-500"
                        : undefined
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
                        ? "bg-slate-500"
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
              onClick={() => {
                setIsAdding(false);
                setWinnerTeam(["", ""]);
                setLoserTeam(["", ""]);
              }}
              textSize="text-base"
              backgroundColor="bg-slate-700"
            >
              cancel
            </Button>
            <Button
              backgroundColor="bg-green-700"
              textSize="text-base"
              onClick={handeSubmit}
            >
              create
            </Button>
          </div>
        </>
      ) : (
        <p className="text-center text-lg">+</p>
      )}
    </Card>
  );
}

export default GameForm;

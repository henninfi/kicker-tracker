import { MouseEvent, useContext, useState } from "react";
import axios from "axios";

import { DataContext } from "../pages";
import { Game, Team } from "../domain/Game";
import Image from "next/image";
import { PlayerId } from "../domain/Player";
import { uniq } from "lodash";
import Button from "./button";
import Card from "./card";

function GameForm() {
  const { refreshGames, players, getPlayer, leaderboard } =
    useContext(DataContext);
  const [isAdding, setIsAdding] = useState(false);
  const [winnerTeam, setWinnerTeam] = useState<Team>(["", ""]);
  const [loserTeam, setLoserTeam] = useState<Team>(["", ""]);

  const [winner1, winner2] = winnerTeam;
  const [loser1, loser2] = loserTeam;

  const isComplete =
    uniq([...winnerTeam, ...loserTeam].filter(Boolean)).length === 4;

  const delta =
    isComplete &&
    leaderboard.getGameDelta(
      new Game("", new Date(), winnerTeam, loserTeam),
      leaderboard.rankedPlayers
    );

  async function handeSubmit(e: MouseEvent<HTMLButtonElement>) {
    if (!isComplete) {
      return;
    }

    await axios.post("/api/games", {
      winnerTeam: [winner1, winner2],
      loserTeam: [loser1, loser2],
    });
    refreshGames();
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
          <p>
            <strong>Winner Team</strong>:{" "}
            {getPlayer(winner1).name || <i>select</i>},{" "}
            {getPlayer(winner2).name || <i>select</i>}
            {delta && (
              <span className="float-right text-green-400">+{delta}</span>
            )}
          </p>
          <div className="flex flex-wrap items-center justify-center">
            {players.map((player) => (
              <div
                key={player.id}
                className={`m-1 p-1 flex flex-col items-center rounded-lg border-2 ${
                  winnerTeam.includes(player.id)
                    ? "border-slate-300"
                    : "border-transparent"
                }`}
                onClick={() => handleWinnerSelect(player.id)}
              >
                <Image
                  src={`/animals/${player.animal}.png`}
                  alt={player.animal}
                  width={32}
                  height={32}
                />
              </div>
            ))}
          </div>
          <p className="mt-2">
            <strong>Loser Team</strong>:{" "}
            {getPlayer(loser1).name || <i>select</i>},{" "}
            {getPlayer(loser2).name || <i>select</i>}
            {delta && (
              <span className="float-right text-red-400">-{delta}</span>
            )}
          </p>
          <div className="flex flex-wrap items-center justify-center">
            {players.map((player) => (
              <div
                key={player.id}
                className={`m-1 p-1 flex flex-col items-center rounded-lg border-2 ${
                  loserTeam.includes(player.id)
                    ? "border-slate-300"
                    : "border-transparent"
                } ${
                  loserTeam.includes(player.id) &&
                  winnerTeam.includes(player.id)
                    ? "border-red-400"
                    : ""
                }`}
                onClick={() => handleLoserSelect(player.id)}
              >
                <Image
                  className="border"
                  src={`/animals/${player.animal}.png`}
                  alt={player.animal}
                  width={32}
                  height={32}
                />
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-4">
            <Button
              onClick={() => {
                setIsAdding(false);
                setWinnerTeam(["", ""]);
                setLoserTeam(["", ""]);
              }}
              label="cancel"
            />
            <Button
              className="bg-green-700"
              onClick={handeSubmit}
              label="create"
            />
          </div>
        </>
      ) : (
        <p className="text-center text-lg">+</p>
      )}
    </Card>
  );
}

export default GameForm;

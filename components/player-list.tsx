import axios from "axios";
import { partition } from "lodash";
import Image from "next/image";
import React, { useContext, useState } from "react";
import { DataContext } from "../data";
import { RatedPlayer } from "../domain/Leaderboard";
import { animals } from "../domain/Player";
import Button from "./button";
import Card from "./card";
import { useFiefUserinfo } from '@fief/fief/nextjs/react';
import { useMutation, useMutationState, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/router';

const NEXT_PUBLIC_API: string | undefined = process.env.NEXT_PUBLIC_API;


function PlayerList() {
  const { leaderboard } = useContext(DataContext);


  // Preparing for optimistic update
  const variables = useMutationState({
    filters: { mutationKey: ['addPlayer'], status: 'pending' },
    select: (mutation) => mutation.state.variables
  })

   // Convert mutation variables to game structure and add to the list
   let optimisticPlayer = null;
   if (variables && variables.length > 0) {
     const [newPlayer]:any = variables;
     optimisticPlayer = {
       id: 'temp-id',
       name: newPlayer.name,
       animal: newPlayer.animal,
       isRetired: false,
       isOptimistic: true,
       rating: 1500.0,
       isTournamentWinner: false
     };
   }

  const rankedPlayers = leaderboard.getRankedPlayers();

  

 

  
  // console.log("rankedPlayers", rankedPlayers)
  const [activePlayers, retiredPlayers] = partition(
    rankedPlayers,
    (player) => !player.isRetired
  );

  if (optimisticPlayer) {
    activePlayers.push(optimisticPlayer); // Add the optimistic game to the events list
    activePlayers.sort((a, b) => a.rating - b.rating);

  }


  return (
    <Card>
      {activePlayers.map((player, i) => (
        <PlayerItem key={player.id} player={player} rank={i + 1} />
      ))}
      {retiredPlayers.map((player, i) => (
        <PlayerItem key={player.id} player={player} />
      ))}
    </Card>
  );
}

function PlayerItem({ player, rank }: { player: RatedPlayer; rank?: number }) {
  const router = useRouter();
  const user = useFiefUserinfo();
  const { players } = useContext(DataContext);
  const [isNameEdit, setIsNameEdit] = useState(false);
  const [isAnimalEdit, setIsAnimalEdit] = useState(false);
  const [values, setValues] = useState(player);
  const sessionId = router.query.sessionId as string;
  const queryClient = useQueryClient();
  

  async function handleSave() {
    await axios.put(`${NEXT_PUBLIC_API}/players/${player.id}`, values);
    setIsNameEdit(false);
    setIsAnimalEdit(false);
    queryClient.invalidateQueries({ queryKey: ['players', sessionId] });
  }

  async function handleRetirement() {
    const confirmed = confirm("Are you sure you want to retire this player?");
    if (!confirmed) {
      return;
    }
    console.log('player', player)
    await axios.put(`${NEXT_PUBLIC_API}/players/${player.id}`, {
      ...player,
      isRetired: true,
    });
    setIsNameEdit(false);
    setIsAnimalEdit(false);
    queryClient.invalidateQueries({ queryKey: ['players', sessionId] });
  }

  async function handleComeback() {
    await axios.put(`${NEXT_PUBLIC_API}/players/${player.id}`, {
      ...player,
      isRetired: false,
    });
    setIsNameEdit(false);
    setIsAnimalEdit(false);
    queryClient.invalidateQueries({ queryKey: ['players', sessionId] });
  }

  return (
    <div
      className={`border-b last:border-0 p-2 border-slate-600 flex items-center relative ${
        player.isRetired ? "opacity-50" : ""
      }`}
    >
      {isAnimalEdit && user ? (
        <div className="flex flex-col">
          <div className="flex flex-wrap">
            <div
              className={`p-1 flex flex-col items-center rounded-lg border-2 ${
                player.animal === values.animal
                  ? "border-slate-300"
                  : "border-transparent"
              }`}
              onClick={() => setValues({ ...values, animal: player.animal })}
            >
              <Image
                src={`/animals/${player.animal}.png`}
                alt={player.animal}
                width={28}
                height={28}
              />
            </div>
            {animals
              .filter(
                (el) => !players.map((player) => player.animal).includes(el)
              )
              .map((el) => (
                <div
                  key={el}
                  className={`p-1 flex flex-col items-center rounded-lg border-2 ${
                    el === values.animal
                      ? "border-slate-300"
                      : "border-transparent"
                  }`}
                  onClick={() => setValues({ ...values, animal: el })}
                >
                  <Image
                    src={`/animals/${el}.png`}
                    alt={el}
                    width={28}
                    height={28}
                  />
                </div>
              ))}
          </div>
          <div className="flex justify-around">
            {player.isRetired && user ? (
              <Button onClick={handleComeback}>come back</Button>
            ) : (
              <Button onClick={handleRetirement}>retire</Button>
            )}
            <Button onClick={handleSave}>save</Button>
          </div>
        </div>
      ) : (
        <>
          <p className="mr-2 w-4 text-slate-300 text-center">{rank || "-"}</p>
          {player.isTournamentWinner && user ? (
            <div className="w-6 flex justify-center items-center flex-col relative">
              <div className="absolute text-xs -right-1 -bottom-1">🥇</div>
              <Image
                src={`/animals/${player.animal}.png`}
                alt={player.animal}
                width={20}
                height={20}
                onClick={() => setIsAnimalEdit(true)}
              />
            </div>
          ) : (
            <Image
              src={`/animals/${player.animal}.png`}
              alt={player.animal}
              width={24}
              height={24}
              onClick={() => setIsAnimalEdit(true)}
            />
          )}
          {isNameEdit && user ? (
            <div className="flex grow">
              <input
                autoFocus
                className="rounded bg-slate-700 px-1 ml-1 mr-2 w-0 grow"
                placeholder="Name"
                value={values.name}
                onChange={(e) => setValues({ ...values, name: e.target.value })}
              ></input>
              <Button onClick={handleSave} className="px-1 py-0">
                save
              </Button>
            </div>
          ) : (
            <>
              <p className="ml-2" onClick={() => setIsNameEdit(true)}>
                {player.name}
              </p>
              <div className="grow"></div>
              <p className="text-slate-400 w-10 text-center">{player.rating}</p>
            </>
          )}
        </>
      )}
    </div>
  );
}

export default PlayerList;
